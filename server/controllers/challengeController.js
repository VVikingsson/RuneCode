const { Challenge } = require('../models');
const { TestCase } = require('../TestCase');
const codeRunner = require('../sandboxing/codeRunner.js');
const mongoose = require('mongoose');

// Running and testing code
async function executeCode(req, res, next) {
    try {
        const {id, code, language} = req.body;
        // Error handling
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Bad request: invalid id.'});
        }
        if (!code || !language) {
            return res.status(400).json({message: 'Bad request: code and/or language not provided.'});
        }
        const challenge = await Challenge.findOne({_id: id}).populate('testCases');
        if (!challenge) {
            return res.status(404).json({message: 'Not found: challenge with id not in database'});
        }

        const {results, passed} = codeRunner.containerizeAndTestCode(code, challenge.testCases, language);
        if (passed) {
            return res.status(200).json(results);
        }
        // Potential bug if passed is null?
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
}


// Creating Challenges
function testCasesValid(testCases) {
    if (!Array.isArray(testCases)) return false;          // Must be an array
    if (testCases.length === 0) return false;            // Must have at least one item

    // Check each test case
    for (const testCase of testCases) {
        if (typeof testCase !== 'object' || testCase === null) return false;
        if (!('language' in testCase)) return false;
        if (!('input' in testCase)) return false;
        if (!('expectedOutput' in testCase)) return false;
    }

    return true;
}

async function createTestCases(testCases) {
    let testIds = [];
    for (test of testCases) {
        const newTestCase = await TestCase.create({
            language: test.language,
            input: test.input,
            expectedOutput: test.expectedOutput
        });
        testIds.push(newTestCase._id);
    }

    return testIds;
}

function createChallenge(req, res, next) {
    try {
        let msg;
        const {name, description, difficulty, codeTemplate, testCases} = req.body
        if (!name || !description || !difficulty || !codeTemplate) {
            msg = "Name or description or difficulty or codeTemplate missing";
        }
        if (!testCasesValid(testCases)) {
            msg = "Test cases incomplete or invalid. Send an array of testcases with language, input, and expectedOutput fields";
        }
        if (msg) {
            return res.status(400).json({message: msg});
        }
        
        const testCaseRefs = createTestCases(testCases);

        Challenge.create({
            name: name,
            description: description,
            difficulty: difficulty,
            codeTemplate: codeTemplate,
            testCases: testCaseRefs
        })

        return res.status(201).json({
            id: newUser._id,
            name: newUser.username,
            email: newUser.email
        });
    } catch (err) {
        if (err.code === 11000) { // Mongoose error for field already existing
            return res.status(400).json({message: 'Challenge with this name already exists'})
        }
        next(err);
    }
}

module.exports = {
    executeCode,
    testCasesValid,
    createTestCases,
    createChallenge
}