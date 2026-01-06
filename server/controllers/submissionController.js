const {DraftSubmission, Submission, User, Challenge} = require('../models');
const mongoose = require('mongoose');

const difficultyPoints = {
    easy: 50,
    medium: 100,
    hard: 200
};

async function createSubmission(req, res, next) {
    try {
        const authorId = req.user.id;
        const {title, authorNote, challengeId} = req.body;
        if (!challengeId || !authorId ) {
            return res.status(400).json({message: 'Bad request: challenge ID or author ID not provided.'});
        }
        console.log(challengeId, authorId);
        for (const objectId of [challengeId, authorId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        const draftSubmission = await DraftSubmission.findOne({challenge: challengeId, author: authorId});
        if (!draftSubmission) {
            return res.status(404).json({message: `No draft found for challenge ${challengeId} and author: ${authorId}`});
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        const prevSubmission = await Submission.findOne({ author: authorId, challenge: challengeId });
        if (prevSubmission) {
            return res.status(400).json({ message: "Challenge already submitted" });
        }
       
        const newSubmission = await Submission.create({
            code: draftSubmission.code,
            title: title,
            authorNote: authorNote,
            author: authorId,
            challenge: challengeId
        });

        await DraftSubmission.findByIdAndDelete(draftSubmission._id);

        const addPoints = difficultyPoints[challenge.difficulty] ?? 0;
        await User.findByIdAndUpdate(authorId, { $inc: { points: addPoints} });

        const submissionObject = newSubmission.toObject();
        submissionObject.pointsAwarded = addPoints;

        res.status(201).json(submissionObject);
    } catch(err) {
        next(err);
    }
}

async function updateSubmission(req, res, next) {
    try{
        //we expect title and authorId from request body
        const {title, authorNote} = req.body;
        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                title: title,
                authorNote: authorNote,
            },
            {new: true}
        );
        if (!updatedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json({ message: 'Submission updated', updatedSubmission: updatedSubmission });

    } catch (err){
        next(err);
    }
}

async function getSubmission(req, res, next) {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({message: "No submission found with given id"});
        }
        res.status(200).json(submission);
    } catch (err) {
        next(err);
    }
}

async function deleteSubmission(req, res, next) {
    try {
        const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
        if (!deletedSubmission) {
            return res.status(404).json({message: "No submission found with given id"});
        }
        res.status(200).json({message: `Submission deleted with id ${deletedSubmission._id}`});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid id format'});
        }
        next(err);
    }
}





module.exports = {
    createSubmission,
    updateSubmission,
    getSubmission,
    deleteSubmission,
};

