const { Challenge, TestCase } = require('../models')

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
        for (testCase of req.body.testCases) {
            const test = TestCase.create(testCase);
            testCaseIds.push(test._id);
        }
        
        const newChallenge = await Challenge.create({name, codeTemplate, description, testCaseIds});

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
            if(req.body[field] !== undefined) {
                if(typeof req.body[field] !== "string" || req.body[field].trim().length === 0) {
                    throw { status: 400, message: `${field} cannot be empty`};
                }
                updates[field] = req.body[field];
            }
        }
    );

    
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // new makes sure the updated challenge is returned
        );                                     
        if (!updatedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ message: 'Challenge updated', challenge: updatedChallenge });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createNewChallenge,
    getChallenge,
    removeChallenge,
    getAllChallenges,
    updateChallenge
}