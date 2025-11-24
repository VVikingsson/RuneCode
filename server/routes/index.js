
const express = require('express');
const exampleRouter = require('./exampleRoutes');
const userRouter = require('./userRoutes');
const testCaseRouter = require('./testCaseRoutes');
const challengeRouter = require('./challengeRoutes');
const submissionRouter = require('./submissionRoutes');

const router = express.Router();

// Any endpoint we want to access from exampleRouter has to be prefixed with /example.
router.use('/example', exampleRouter);
router.use('/users', userRouter);
router.use('/testCases', testCaseRouter);
router.use('/challenges', challengeRouter);
router.use('/submissions', submissionRouter);

module.exports = router;