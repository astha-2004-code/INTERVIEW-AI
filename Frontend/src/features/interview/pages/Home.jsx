import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { subscribeToInterviewProgress } from '../../../services/socket.service.js'

const Home = () => {
    const { loading, error, setError, generateReport, reports } = useInterview()
    const [ localError, setLocalError ] = useState(null)
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ generationProgress, setGenerationProgress ] = useState(0)
    const [ generationMessage, setGenerationMessage ] = useState("Initializing...")
    const [ activeStage, setActiveStage ] = useState("")
    const [ resumeFileName, setResumeFileName ] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        setLocalError(null)
        setError(null)

        if (!jobDescription.trim()) {
            setLocalError("Target Job Description is required.")
            return
        }

        const resumeFile = resumeInputRef.current?.files?.[0]
        if (!resumeFile && !selfDescription.trim()) {
            setLocalError("Either a Resume upload or a Quick Self-Description is required to build your plan.")
            return
        }

        const generationId = Date.now().toString() + Math.random().toString(36).substring(2)
        setGenerationProgress(0)
        setGenerationMessage("Connecting...")
        setActiveStage("starting")

        const unsubscribe = subscribeToInterviewProgress(generationId, {
            onStarted: (data) => {
                setGenerationMessage(data.message)
                setActiveStage("started")
            },
            onProgress: (data) => {
                setGenerationProgress(data.progress)
                setGenerationMessage(data.message)
                setActiveStage(data.stage)
            },
            onCompleted: () => {
                setGenerationProgress(100)
                setGenerationMessage("Complete!")
                setActiveStage("completed")
                // we can also navigate here if we want, but REST resolves too
            },
            onError: (data) => {
                setLocalError(data.message)
            },
            onDisconnect: (reason) => {
                // If it disconnects during generation, gracefully fallback
                if (activeStage !== "completed") {
                    setGenerationMessage("Connection interrupted. Still generating in the background, please wait...")
                }
            },
            onReconnect: () => {
                if (activeStage !== "completed") {
                    setGenerationMessage("Connection restored. Resuming progress...")
                }
            }
        })

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile, generationId })
            unsubscribe()
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setLocalError("Failed to generate plan. No response data returned.")
            }
        } catch (err) {
            unsubscribe()
            setLocalError(err.message || "Failed to generate interview strategy.")
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='progress-container' style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#1a1f27', textAlign: 'center' }}>Generating Your Interview Strategy</h2>
                    
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <div style={{ height: '100%', width: `${generationProgress}%`, background: '#2563eb', transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem', color: '#4b5563', lineHeight: 2.2 }}>
                        <li>{generationProgress >= 15 ? '✓' : (activeStage === 'starting' ? '●' : '○')} Starting interview analysis</li>
                        <li>{generationProgress >= 50 ? '✓' : (activeStage === 'resume_parsing' ? '●' : '○')} Parsing resume</li>
                        <li>{generationProgress >= 70 ? '✓' : (activeStage === 'analyzing_job' ? '●' : '○')} Analyzing job description</li>
                        <li>{generationProgress >= 85 ? '✓' : (activeStage === 'generating_questions' ? '●' : '○')} Generating interview questions</li>
                        <li>{generationProgress >= 95 ? '✓' : (activeStage === 'creating_roadmap' ? '●' : '○')} Creating preparation roadmap</li>
                        <li>{generationProgress >= 100 ? '✓' : (activeStage === 'saving_strategy' ? '●' : '○')} Saving your strategy</li>
                    </ul>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#334155', fontWeight: 500, textAlign: 'center' }}>
                        Current status:<br/>
                        <span style={{ color: '#2563eb', display: 'inline-block', marginTop: '0.5rem' }}>"{generationMessage}"</span>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <div className='home-page'>
            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                {localError && (
                    <div className="error-banner">
                        <span className="error-icon">⚠</span>
                        <p>{localError}</p>
                        <button className="close-btn" onClick={() => setLocalError(null)}>×</button>
                    </div>
                )}
                {error && !localError && (
                    <div className="error-banner">
                        <span className="error-icon">⚠</span>
                        <p>{error}</p>
                        <button className="close-btn" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <div className='interview-card__body'>
                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className='dropzone' htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='dropzone__title'>
                                    {resumeFileName ? resumeFileName : 'Click to upload or drag & drop'}
                                </p>
                                <p className='dropzone__subtitle'>PDF or DOCX (Max 3MB)</p>
                                <input 
                                    ref={resumeInputRef} 
                                    hidden 
                                    type='file' 
                                    id='resume' 
                                    name='resume' 
                                    accept='.pdf,.docx' 
                                    onChange={(e) => {
                                        setLocalError(null);
                                        if (e.target.files && e.target.files[0]) {
                                            setResumeFileName(e.target.files[0].name);
                                        } else {
                                            setResumeFileName(null);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        {loading ? 'Generating Strategy...' : 'Generate My Interview Strategy'}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports && reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home