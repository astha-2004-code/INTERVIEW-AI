const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const userModel = require("../models/user.model")
const { emitInterviewProgress, emitInterviewCompleted, emitInterviewError, emitInterviewStarted } = require("../socket/socket")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    const { selfDescription, jobDescription, generationId } = req.body
    const userId = req.user.id

    try {
        if (generationId) {
            emitInterviewStarted({ userId, generationId, message: "Starting interview analysis..." })
        }

        let resumeText = ""
        if (req.file && req.file.buffer) {
            if (generationId) {
                emitInterviewProgress({ userId, generationId, stage: "resume_parsing", progress: 15, message: "Uploading and processing your profile..." })
                emitInterviewProgress({ userId, generationId, stage: "resume_parsing", progress: 30, message: "Parsing your resume..." })
            }
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = parsed.text || ""
        }

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either a resume file or a self description is required."
            })
        }

        if (generationId) {
            emitInterviewProgress({ userId, generationId, stage: "analyzing_job", progress: 50, message: "Analyzing the job description..." })
            emitInterviewProgress({ userId, generationId, stage: "generating_questions", progress: 70, message: "Generating personalized technical and behavioral questions..." })
            emitInterviewProgress({ userId, generationId, stage: "creating_roadmap", progress: 85, message: "Creating your preparation roadmap..." })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        if (generationId) {
            emitInterviewProgress({ userId, generationId, stage: "saving_strategy", progress: 95, message: "Saving your interview strategy..." })
        }

        const interviewReport = await interviewReportModel.create({
            user: userId,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        if (generationId) {
            emitInterviewProgress({ userId, generationId, stage: "completed", progress: 100, message: "Interview strategy generated successfully." })
            emitInterviewCompleted({ userId, generationId, interviewReport })
        }

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error in generateInterViewReportController:", err)
        if (generationId) {
            emitInterviewError({ userId, generationId, message: err.message || "Failed to generate interview strategy." })
        }
        return res.status(500).json({
            message: "Failed to generate interview strategy.",
            error: err.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error in getInterviewReportByIdController:", err)
        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: err.message
        })
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (err) {
        console.error("Error in getAllInterviewReportsController:", err)
        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: err.message
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        const user = await userModel.findById(req.user.id)
        let username = "Interview_AI"
        if (user && user.username) {
            username = user.username.trim().replace(/[^a-zA-Z0-9]/g, "_")
        }
        const filename = `${username}_Resume.pdf`

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`
        })

        return res.send(pdfBuffer)
    } catch (err) {
        console.error("Error in generateResumePdfController:", err)
        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: err.message
        })
    }
}

/**
 * @description Controller to delete an interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;

        const deletedReport = await interviewReportModel.findOneAndDelete({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!deletedReport) {
            return res.status(404).json({
                message: "Interview report not found or you don't have permission to delete it."
            });
        }

        return res.status(200).json({
            message: "Interview report deleted successfully."
        });
    } catch (err) {
        console.error("Error in deleteInterviewReportController:", err);
        return res.status(500).json({
            message: "Failed to delete interview report.",
            error: err.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    deleteInterviewReportController
}