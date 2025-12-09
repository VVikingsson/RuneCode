const { Challenge, TestCase, DraftSubmission, Submission, User} = require('../models');
const codeRunner = require('../sandboxing/codeRunner.js');
const mongoose = require('mongoose');

// Running and testing code
async function executeCode(req, res, next) {
    try {
        console.log("Executing code");
        //later add code hash check so that a user cannot submit two identical submissions
        // Submission.findBy(authorID).where(hash(code) == hash_code)
        const {code, language, authorId, id} = req.body;
        // Error handling
        for (const objectId of [id, authorId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        if (!code || !language || !authorId ) {
            return res.status(400).json({message: 'Bad request: code and/or language and/or author ID not provided.'});
        }
        const challenge = await Challenge.findOne({_id: id}).populate('testCases'); // populate replaces ids with actual testCase objects
        if (!challenge) {
            return res.status(404).json({message: 'Not found: challenge with id not in database'});
        }

        let testCases;
        if (language.toLowerCase() == "python") {
            // Filter for Python test cases
            testCases = challenge.testCases.filter(tc => tc.language.toLowerCase() === "python");
        } else if (language.toLowerCase() == "javascript") {
            // Filter for JavaScript test cases
            testCases = challenge.testCases.filter(tc => tc.language.toLowerCase() === "javascript");
        }

        const {result, passed} = await codeRunner.containerizeAndTestCode(code, testCases, language);
        if (passed) {
            //create a submission draft
            const draftSubmission = await DraftSubmission.findOneAndReplace(
                {author: authorId, challenge: id},
                {code : code,
                author : authorId,
                challenge : id},
                {upsert: true, new: true},
            )
            return res.status(201).json({message: result, passed: passed, newSubmission: draftSubmission});
        } else {
            return res.status(200).json({message: result, passed: passed});
        }
    } catch (err) {
        next(err);
    }
}

async function createNewChallenge(req, res, next) {
    try {
        const {name, codeTemplatePython, codeTemplateJavascript, description, testCases, difficulty, tags} = req.body
        if (!name || !codeTemplatePython || !codeTemplateJavascript || !description || !testCases || !difficulty) {
            return res.status(400).json({message: 'Name or code template or description or test cases or difficulty is missing.'});
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({ message: 'testCases must be a non-empty array of IDs.' });
        }

        let testCaseIds = [];
        for (const testCase of testCases) {
            const test = await TestCase.create(testCase);
            testCaseIds.push(test._id);
        }
        
        const newChallenge = await Challenge.create({
            name: name, 
            codeTemplatePython: codeTemplatePython, 
            codeTemplateJavascript: codeTemplateJavascript,
            description: description, 
            testCases: testCaseIds,
            difficulty: difficulty,
            tags: tags});

        return res.status(201).json({
            id: newChallenge._id,
            name: newChallenge.name,
            codeTemplatePython: newChallenge.codeTemplatePython,
            codeTemplateJavascript: newChallenge.codeTemplateJavascript,
            description: newChallenge.description,
            testCases: newChallenge.testCases,
            difficulty: newChallenge.difficulty,
            tags: newChallenge.tags
        });
    } catch (err) {
        if (err.code === 11000 && err.keyValue) { // Mongoose error for field already existing
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({message: `A challenge with ${field} already exists`})
        }
        next(err);
    }
}

async function getChallenge(req, res, next) {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({message: "No challenge found with this ID"})
        }
    return res.status(200).json({
        challenge: challenge,
        links: [
            {   // Follows RFC 5988 standard (something I found online)
                rel: "execute",     // "relation": how is this resource linked to the current context  
                href: "/api/v1/challenges/execute/:id", // link
                title: "Execute code for this challenge"
            },
            {
                rel: "submissions",     
                href: "/api/v1/challenges/:id/submissions",
                title: "List submissions related to this challenge"
            },
            {
                rel: "home",   
                href: "/api/v1/",
                title: "API root"
            }
        ]
    });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid ID format'});
        }
        next(err);
    }
}

async function removeChallenge(req, res, next) {
    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
        if (!deletedChallenge) {
            return res.status(404).json({message: "No challenge found with this id"});
        }
        return res.status(200).json({message: `Successfully deleted challenge ${deletedChallenge.name}`});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid ID format'});
        }
        next(err);
    }
}

async function getAllChallenges(req, res, next) {
    try {
        const challenges = await Challenge.find();
        return res.status(200).json(challenges);
    } catch (err) {
        next(err);
    }
}

async function updateChallenge(req, res, next) {
    try {
        const allowedFields = ['name', 'codeTemplate', 'description', 'testCases'];
        const updates = {};
        allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    if (typeof req.body[field] !== "string" || req.body[field].trim().length === 0) {
                        throw {status: 400, message: `${field} cannot be empty`};
                    }
                    updates[field] = req.body[field];
                }
            }
        );

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true} // new makes sure the updated challenge is returned
        );
        if (!updatedChallenge) {
            return res.status(404).json({message: 'Challenge not found'});
        }
        return res.status(200).json({ message: 'Challenge updated', challenge: updatedChallenge });
    } catch (err) {
        next(err);
    }
}

async function addTestCase(req, res, next) {
    try {
        const {input, expectedOutput, language} = req.body;
        if (!input || !expectedOutput || !language) {
            return res.status(400).json({message: 'Bad request: Must provide input, expectedOutput, and language fields.'});
        }
        // Create testcase
        const tc = await TestCase.create({
            input: input,
            expectedOutput: expectedOutput,
            language: language
        });
        // Add testcase to challenge and save updates
        const chall = await Challenge.findById(req.params.id);
        if (Array.isArray(chall.testCases)) {
            chall.testCases.push(tc._id);
        } else {
            chall.testCases = [tc._id];
        }
        chall.save();
        return res.status(201).json({
            message: 'Successfully added new test case to challenge',
            challenge: chall.name,
            testCase: chall.testCases[chall.testCases.length - 1]
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Bad request: Not a valid MongoDB object ID.'});
        }
        next(err);
    }
}

async function getRelatedTestCases (req, res, next) {
    try {
        const chall = await Challenge.findById(req.params.id).populate('testCases');
        if (!chall) {
            return res.status(404).json({message: `Not found: no challenge found with id ${req.params.id}`});
        }
        const testCases = chall.testCases;
        if (!Array.isArray(testCases) || testCases.length < 1) {
            return res.status(500).json({message: 'No test cases found for this challenge.'}); // Internal server error, because this
        }                                                                               // should not be possible.
        return res.status(200).json({testCases: testCases});
    } catch (err) {
        if (err.name == 'CastError') {
            return res.status(400).json({message: 'Bad request: Not a valid MongoDB object ID.'});
            next(err);
        }
    }
}

async function removeRelatedTestCase (req, res, next) {
    try {
        const {id, testCaseId} = req.params;
        for (const objectId of [id, testCaseId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        const updatedChall = await Challenge.findByIdAndUpdate(id,
            {$pull: {testCases: testCaseId}},
            {new: true}
        );
        if (!updatedChall) {
            return res.status(404).json({message: `Not found: no challenge found with id ${id}`});
        }
        return res.status(200).json(updatedChall);
    } catch (err) {
        next(err);
    }
}

async function getRelatedTestCase(req, res, next) {
    try {
        const {id, testCaseId} = req.params;
        for (const objectId of [id, testCaseId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        const chall = await Challenge.findById(id).populate('testCases');
        if (!chall) {
            return res.status(404).json({
                message: `Not found: no challenge found with id ${id}`
            });
        }
        let testCase;
        chall.testCases.forEach(tc => {
            if (tc._id.toString() === testCaseId) {
                console.log('found');
                return testCase = tc;
            }
        })
        if (!testCase) {
            return res.status(404).json({
                message: `Not found: no related test case found with id ${testCaseId}`
            });
        }
        res.status(200).json(testCase);
        res.status(200).json({message: 'Challenge updated', challenge: updatedChallenge});
    } catch (err) {
        next(err);
    }
}

async function getRelatedSubmissions(req, res, next) {
    try {
        const challengeId = req.params.id;
        if (!mongoose.isValidObjectId(challengeId)) {
            return res.status(400).json({
                message: `Bad request: Not a valid MongoDB object ID: ${challengeId}`})
        }
        const submissions = await Submission.find({challenge: challengeId});
        res.status(200).json(submissions);
    } catch(err) {
        next(err);
    }
}

async function getRecommendedChallenge(req, res, next) {
    try {
        const user = await User.findById(req.query.recommendedChallengeFor);
        if (!user) {
            return res.status(404).json({message: 'Not found: No user found with provided id'});
        }
        let submitted = await Submission.distinct('challenge', { author: user._id });
        const recommendedChallenge = await Challenge.findOne({_id: {$nin: submitted}});
        
        return res.status(200).json({recommendedChallenge});

    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid id format'});
        }
        next(err);
    }
}

module.exports = {
    executeCode,
    createNewChallenge,
    getChallenge,
    removeChallenge,
    getAllChallenges,
    updateChallenge,
    addTestCase,
    getRelatedTestCases,
    removeRelatedTestCase,
    getRelatedTestCase,
    getRelatedSubmissions,
    getRecommendedChallenge
}