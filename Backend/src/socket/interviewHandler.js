const { generateAnswerFeedback } = require("../services/ai.service");
const answerFeedbackModel = require("../models/answerFeedback.model");

module.exports = function (io, socket) {
    socket.on("answer:submit", async (data) => {
        try {
            const { interviewId, question, answer, resume, jobDescription } = data;
            
            if (!interviewId || !question || !answer) {
                return socket.emit("answer:error", { message: "Missing required fields" });
            }

            // Emit analyzing state
            socket.emit("answer:analyzing", { message: "AI is analyzing your answer..." });

            // Call AI service
            const feedback = await generateAnswerFeedback({
                question,
                answer,
                resume,
                jobDescription
            });

            // Save to DB
            const savedFeedback = await answerFeedbackModel.create({
                interviewId,
                userId: socket.user.id,
                question,
                userAnswer: answer,
                score: feedback.score,
                strengths: feedback.strengths,
                weaknesses: feedback.weaknesses,
                missingPoints: feedback.missingPoints,
                suggestions: feedback.suggestions,
                betterAnswer: feedback.betterAnswer,
                followUpQuestion: feedback.followUpQuestion
            });

            // Emit final feedback
            socket.emit("answer:feedback", savedFeedback);
        } catch (err) {
            console.error("Error in answer:submit:", err);
            socket.emit("answer:error", { message: "Failed to analyze answer" });
        }
    });
};
