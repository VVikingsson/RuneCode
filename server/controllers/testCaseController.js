const { TestCase } = require('../models')

async function createNewTestCase(req, res, next) {
    try {
        const {input, expectedOutput, language} = req.body
        if (!input || !expectedOutput || !language) {
            return res.status(400).json({message: 'Input or expectedOutput or language is missing'});
        }
        const newTestCase = await TestCase.create({input, expectedOutput, language});

        return res.status(201).json({
            id: newTestCase._id,
            input: newTestCase.input,
            expectedOutput: newTestCase.expectedOutput,
            language: newTestCase.language
            
        });
    } catch (err) {

        next(err);

    }
}

async function getTestCase(req, res, next) {
    try {
        const testCase = await TestCase.findById(req.params.id);
        if (!testCase) {
            res.status(404).json({message: "No testCase found with this ID"})
        }
    res.status(200).json(testCase);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid ID format'});
        }
        next(err);
    }
}

async function removeTestCase(req, res, next) {
    try {
        const deletedTestCase = await TestCase.findByIdAndDelete(req.params.id);
        if (!deletedTestCase) {
            res.status(404).json({message: "No testCase found with this id"});
        }
        res.status(200).json({message: `Successfully deleted testCase ${deletedTestCase.input}`});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid ID format'});
        }
        next(err);
    }
}

async function getAllTestCases(req, res, next) {
    try {
        const testCases = await TestCase.find();
        res.status(200).json(testCases);
    } catch (err) {
        next(err);
    }
}

async function updateTestCase(req, res, next) {
    try {
        const allowedFields = ['input', 'expectedOutput', 'language'];
        const updates = {};
        allowedFields.forEach(field => {
            if(req.body[field] !== undefined) {
                if(typeof req.body[field] !== "string" || req.body[field].trim().length === 0) {
                    return res.status(400).json({message: `${field} cannot be empty`});
                }
                updates[field] = req.body[field];
            }
        }
        );

        const updatedTestCase = await TestCase.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // new makes sure the updated testCase is returned
        );                                     
        if (!updatedTestCase) {
            return res.status(404).json({ message: 'TestCase not found' });
        }
        res.status(200).json({ message: 'TestCase updated', testCase: updatedTestCase });
    } catch (err) {

        //400 invalid ID format
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format"} );
        }

        next(err);
    }
}

async function replaceTestCase(req, res, next) {
    try {
        const {input, expectedOutput, language} = req.body;

        if (!input || ! expectedOutput || !language) {
            res.status(400).json({message: 'Bad request: Must provide id, input, expectedOutput, and language when replacing a test case.'});
        }
        const replacedTestCase = await TestCase.findByIdAndUpdate(req.params.id, {
            input: input,
            expectedOutput: expectedOutput,
            language: language
        }, 
        {new: true});
        if (!replacedTestCase) {
            res.status(404).json({message: `Not found: Test case with id not found: ${req.params.id} .`});
        }
        res.status(200).json({
            message: 'Successfully replaced test case.',
            input: replacedTestCase.input,
            expectedOutput: replacedTestCase.expectedOutput,
            language: replacedTestCase.language
        });
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).json({message: 'Bad request: Not a valid MongoDB object ID.'});
        }
        next(err);
    }
}

module.exports = {
    createNewTestCase,
    getTestCase,
    removeTestCase,
    getAllTestCases,
    updateTestCase,
    replaceTestCase
}