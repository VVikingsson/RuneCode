const { Challenge, TestCase, DraftSubmission, Submission} = require('../models');
const codeRunner = require('../sandboxing/codeRunner.js');
const mongoose = require('mongoose');

// Running and testing code
async function executeCode(req, res, next) {
    try {
        const id = req.params.id;
        //later add code hash check so that a user cannot submit two identical submissions
        // Submission.findBy(authorID).where(hash(code) == hash_code)
        const {code, language, authorId} = req.body;
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

        const {result, passed} = await codeRunner.containerizeAndTestCode(code, challenge.testCases, language);
        if (passed){
            //create a submission draft
            const draftSubmission = await DraftSubmission.findOneAndReplace(
                {author: authorId, challenge: id},
                {code : code,
                author : authorId,
                challenge : id},
                {upsert: true, new: true},
            )
            return res.status(201).json({message: result, newSubmission: draftSubmission});
        } else{
            return res.status(200).json({message: result, passed: passed});
        }
    } catch (err) {
        next(err);
    }
}

async function createNewChallenge(req, res, next) {
    try {
        const {name, codeTemplate, description, testCases} = req.body
        if (!name || !codeTemplate || !description || !testCases) {
            return res.status(400).json({message: 'Name or code template or description or test cases are missing.'});
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
            codeTemplate: codeTemplate, 
            description: description, 
            testCases: testCaseIds});

        return res.status(201).json({
            id: newChallenge._id,
            name: newChallenge.name,
            codeTemplate: newChallenge.codeTemplate,
            description: newChallenge.description,
            testCases: newChallenge.testCases
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
            res.status(404).json({message: "No challenge found with this ID"})
        }
    res.status(200).json(challenge);
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
            res.status(404).json({message: "No challenge found with this id"});
        }
        res.status(200).json({message: `Successfully deleted challenge ${deletedChallenge.name}`});
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
        res.status(200).json(challenges);
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

module.exports = {
    executeCode,
    createNewChallenge,
    getChallenge,
    removeChallenge,
    getAllChallenges,
    updateChallenge,
    getRelatedSubmissions,
}