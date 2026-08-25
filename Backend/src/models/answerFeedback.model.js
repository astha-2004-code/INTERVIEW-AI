const mongoose = require('mongoose');

const answerFeedbackSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    question: {
        type: String,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    strengths: [String],
    weaknesses: [String],
    missingPoints: [String],
    suggestions: [String],
    betterAnswer: {
        type: String,
        required: true
    },
    followUpQuestion: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const answerFeedbackModel = mongoose.model("AnswerFeedback", answerFeedbackSchema);

module.exports = answerFeedbackModel;
