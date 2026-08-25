import React, { useState, useEffect } from 'react';
import { submitAnswer, subscribeToAnswerFeedback } from '../../../services/socket.service';
import './MockInterview.scss';

const MockInterview = ({ report }) => {
    const allQuestions = [...report.technicalQuestions, ...report.behavioralQuestions];
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
    const [answerText, setAnswerText] = useState("");
    const [status, setStatus] = useState("idle"); // idle, analyzing, feedback, error
    const [statusMessage, setStatusMessage] = useState("");
    const [feedback, setFeedback] = useState(null);

    const activeQuestion = allQuestions[selectedQuestionIdx];

    useEffect(() => {
        const unsubscribe = subscribeToAnswerFeedback({
            onAnalyzing: (data) => {
                setStatus("analyzing");
                setStatusMessage(data.message);
            },
            onFeedback: (data) => {
                setStatus("feedback");
                setFeedback(data);
            },
            onError: (data) => {
                setStatus("error");
                setStatusMessage(data.message);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = () => {
        if (!answerText.trim()) return;
        
        setStatus("analyzing");
        setStatusMessage("Sending answer...");
        setFeedback(null);

        submitAnswer({
            interviewId: report._id,
            question: activeQuestion.question,
            answer: answerText,
            resume: report.resume,
            jobDescription: report.jobDescription
        });
    };

    const handleNext = () => {
        if (selectedQuestionIdx < allQuestions.length - 1) {
            setSelectedQuestionIdx(selectedQuestionIdx + 1);
            setAnswerText("");
            setStatus("idle");
            setFeedback(null);
        }
    };

    return (
        <div className="mock-interview">
            <div className="mock-header">
                <h2>Live Mock Interview</h2>
                <select 
                    value={selectedQuestionIdx} 
                    onChange={(e) => {
                        setSelectedQuestionIdx(Number(e.target.value));
                        setAnswerText("");
                        setStatus("idle");
                        setFeedback(null);
                    }}
                    className="question-selector"
                >
                    {allQuestions.map((q, idx) => (
                        <option key={idx} value={idx}>Question {idx + 1}: {q.question.substring(0, 50)}...</option>
                    ))}
                </select>
            </div>

            <div className="mock-content">
                <div className="question-panel">
                    <span className="question-badge">Question {selectedQuestionIdx + 1}</span>
                    <h3 className="question-text">{activeQuestion.question}</h3>
                    
                    <textarea 
                        className="answer-input"
                        placeholder="Type your answer here..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        disabled={status === "analyzing"}
                    ></textarea>

                    <div className="action-row">
                        <button 
                            className="submit-btn" 
                            onClick={handleSubmit}
                            disabled={!answerText.trim() || status === "analyzing"}
                        >
                            {status === "analyzing" ? "Analyzing..." : "Submit Answer"}
                        </button>
                    </div>
                </div>

                <div className="feedback-panel">
                    {status === "idle" && (
                        <div className="empty-feedback">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <p>Submit an answer to receive live AI feedback.</p>
                        </div>
                    )}

                    {status === "analyzing" && (
                        <div className="analyzing-state">
                            <div className="spinner"></div>
                            <p>{statusMessage}</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="error-state">
                            <span className="error-icon">⚠</span>
                            <p>{statusMessage}</p>
                            <button onClick={handleSubmit}>Try Again</button>
                        </div>
                    )}

                    {status === "feedback" && feedback && (
                        <div className="feedback-result fade-in">
                            <div className="feedback-header">
                                <h3>AI Evaluation</h3>
                                <div className={`score-badge ${feedback.score >= 80 ? 'high' : feedback.score >= 60 ? 'mid' : 'low'}`}>
                                    {feedback.score}/100
                                </div>
                            </div>
                            
                            {feedback.strengths.length > 0 && (
                                <div className="feedback-section strengths">
                                    <h4><span className="icon">✓</span> Strengths</h4>
                                    <ul>{feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                            )}

                            {feedback.weaknesses.length > 0 && (
                                <div className="feedback-section weaknesses">
                                    <h4><span className="icon">⚠</span> Areas for Improvement</h4>
                                    <ul>{feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                                </div>
                            )}

                            {feedback.missingPoints.length > 0 && (
                                <div className="feedback-section missing">
                                    <h4><span className="icon">⚡</span> Missing Concepts</h4>
                                    <ul>{feedback.missingPoints.map((m, i) => <li key={i}>{m}</li>)}</ul>
                                </div>
                            )}

                            {feedback.suggestions.length > 0 && (
                                <div className="feedback-section suggestions">
                                    <h4><span className="icon">💡</span> AI Suggestion</h4>
                                    <ul>{feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                            )}

                            {feedback.followUpQuestion && (
                                <div className="feedback-section follow-up">
                                    <h4><span className="icon">💬</span> Follow-up Question</h4>
                                    <p className="follow-up-text">"{feedback.followUpQuestion}"</p>
                                </div>
                            )}

                            <button className="next-btn" onClick={handleNext}>Next Question</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockInterview;
