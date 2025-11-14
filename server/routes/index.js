
const express = require('express');
const exampleRouter = require('./exampleRoutes');
const userRouter = require('./userRoutes');

const router = express.Router();

// Any endpoint we want to access from exampleRouter has to be prefixed with /example.
router.use('/example', exampleRouter);
router.use('/user', userRouter);

module.exports = router;