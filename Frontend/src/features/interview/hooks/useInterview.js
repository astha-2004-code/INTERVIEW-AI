import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { AuthContext } from "../../auth/auth.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const authContext = useContext(AuthContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context
    const user = authContext?.user

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            console.error("Error in generateReport hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Failed to generate interview strategy."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            console.error("Error in getReportById hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Failed to fetch interview report."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (err) {
            console.error("Error in getReports hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Failed to fetch interview plans."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError(null)
        try {
            const blobData = await generateResumePdf({ interviewReportId })
            
            // Create object URL directly from the Axios blob data
            const url = window.URL.createObjectURL(blobData)
            const link = document.createElement("a")
            link.href = url

            // Build a highly meaningful filename (e.g. Astha_Jha_Software_Engineer_Resume.pdf)
            const username = user?.username ? user.username.trim().replace(/[^a-zA-Z0-9]/g, "_") : "Candidate"
            const jobTitle = report?.title ? report.title.trim().replace(/[^a-zA-Z0-9]/g, "_") : "Tailored"
            const filename = `${username}_${jobTitle}_Resume.pdf`
            
            link.setAttribute("download", filename)
            document.body.appendChild(link)
            link.click()
            
            // Clean up resources
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        }
        catch (err) {
            console.error("Error in getResumePdf hook:", err)
            let errMsg = "Failed to generate or download resume PDF."
            
            // Extract server-side JSON error messages from the response Blob
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text()
                    const json = JSON.parse(text)
                    errMsg = json.message || errMsg
                } catch (e) {
                    if (err.message) errMsg = err.message
                }
            } else {
                errMsg = err.response?.data?.message || err.message || errMsg
            }

            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, error, setError, generateReport, getReportById, getReports, getResumePdf }
}