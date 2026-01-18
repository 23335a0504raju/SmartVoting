import { AlertCircle, CheckCircle, Eye, RotateCcw, ScanFace, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../../styles/components.css';

const LivenessChallenge = ({ onVerify, onCancel, user }) => {
    const [status, setStatus] = useState('idle'); // idle, capturing, processing, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const webcamRef = useRef(null);

    // Capture Loop
    const startScan = async () => {
        if (!webcamRef.current) return;

        setStatus('capturing');
        setProgress(0);
        setErrorMessage('');

        const frames = [];
        const TOTAL_FRAMES = 5; // Capture 5 frames to ensure we catch a blink
        const INTERVAL_MS = 300; // 300ms gap -> 1.5s total scan time

        try {
            // Helper to capture one frame
            const captureFrame = () => {
                const src = webcamRef.current.getScreenshot();
                if (src) frames.push(src);
            };

            // Capture Loop
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                captureFrame();
                setProgress(((i + 1) / TOTAL_FRAMES) * 100);
                await new Promise(r => setTimeout(r, INTERVAL_MS));
            }

            if (frames.length === 0) throw new Error("Camera failed to capture images");

            // Send to Backend
            setStatus('processing');

            // Pass ALL frames. Backend will find Open/Closed eyes.
            const result = await onVerify(frames);

            if (result === true || result?.success) {
                setStatus('success');
            } else {
                setStatus('error');

                // Construct error object for UI
                const checks = result?.checks || null;
                const msgs = result?.messages || {};

                let mainMsg = "Verification failed.";
                if (checks) {
                    if (!checks.identity) mainMsg = `Identity Mismatch: ${msgs.identity}`;
                    else if (!checks.liveness) mainMsg = `Liveness Failed: ${msgs.liveness}`;
                } else {
                    mainMsg = result?.error || "Unknown error";
                }

                setErrorMessage({ msg: mainMsg, checks: checks });
            }

        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message || "Camera error");
        }
    };

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage('');
        setProgress(0);
    };

    return (
        <div className="liveness-container">
            <div className="liveness-header">
                <h2>Secure Verification</h2>
                <button className="close-btn" onClick={onCancel}>
                    <X size={20} />
                </button>
            </div>

            {status === 'success' ? (
                <div className="success-view">
                    <div className="success-icon">
                        <CheckCircle size={80} />
                    </div>
                    <h3>Identity Verified!</h3>
                    <p className="success-message">Liveness check passed. You are authorized to vote.</p>
                </div>
            ) : (
                <div className="scan-section">

                    {/* Instructions */}
                    <div className="instruction-card">
                        <div className="instruction-icon"><Eye size={32} /></div>
                        <div className="instruction-text">
                            <h3>Look & Blink</h3>
                            <p>Look at the camera and <strong>blink naturally</strong> during the scan.</p>
                        </div>
                    </div>

                    {/* Camera */}
                    <div className="camera-frame-large">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={0.8}  // Increased from 0.7
                            videoConstraints={{
                                facingMode: "user",
                                width: { ideal: 1280 },  // Increased resolution
                                height: { ideal: 720 },   // 720p for better quality
                                frameRate: { ideal: 30 }  // Smoother video
                            }}
                            className="webcam-view"
                        />

                        {/* Overlay Rings */}
                        <div className={`scan-overlay ${status === 'capturing' ? 'scanning' : ''}`}>
                            <div className="scan-ring"></div>
                        </div>

                        {/* Status Messages */}
                        {status === 'capturing' && (
                            <div className="scan-status">
                                <span className="blink-dot"></span>
                                Scanning... Please Blink
                            </div>
                        )}

                        {/* Verifying Overlay */}
                        {status === 'processing' && (
                            <div className="verification-overlay-full">
                                <div className="verification-spinner-large"></div>
                                <div className="verification-text">
                                    <h3>Verifying Details...</h3>
                                    <p>Checking Biometrics</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Granular Result Feedback (If Error) */}
                    {status === 'error' && errorMessage && errorMessage.checks && (
                        <div className="verification-checklist">
                            <div className={`check-item ${errorMessage.checks.identity ? 'pass' : 'fail'}`}>
                                {errorMessage.checks.identity ? <CheckCircle size={16} /> : <X size={16} />}
                                <span>Face Identity Match</span>
                            </div>
                            <div className={`check-item ${errorMessage.checks.liveness ? 'pass' : 'fail'}`}>
                                {errorMessage.checks.liveness ? <CheckCircle size={16} /> : <X size={16} />}
                                <span>Liveness (Blink)</span>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {status === 'capturing' && (
                        <div className="scan-progress-container">
                            <div className="scan-progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}

                    {/* Error Display */}
                    {status === 'error' && (
                        <div className="error-card">
                            <AlertCircle size={20} />
                            <div className="error-content">
                                <h5>Verification Failed</h5>
                                <p>{errorMessage.msg || errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="action-buttons">
                        {status === 'error' ? (
                            <button className="btn-primary" onClick={handleRetry}>
                                <RotateCcw size={18} /> Retry
                            </button>
                        ) : status === 'processing' ? (
                            <button className="btn-primary" disabled>
                                Verifying...
                            </button>
                        ) : status === 'capturing' ? (
                            <button className="btn-primary" disabled>
                                Scanning...
                            </button>
                        ) : (
                            <button className="btn-primary" onClick={startScan}>
                                <ScanFace size={20} /> Start Verification
                            </button>
                        )}

                        {status !== 'capturing' && status !== 'processing' && (
                            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LivenessChallenge;