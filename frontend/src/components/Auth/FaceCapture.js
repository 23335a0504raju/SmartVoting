import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../../styles/components.css';

const FaceCapture = ({ onCapture, mode = 'register', onBack, loading = false }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [livenessMessage, setLivenessMessage] = useState("Position your face in the center");

    // Configuration for webcam
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const confirm = () => {
        if (imgSrc) {
            onCapture(imgSrc);
        }
    };

    // Mock Liveness Check loop
    useEffect(() => {
        if (!imgSrc && mode === 'login') {
            const timer = setTimeout(() => {
                setLivenessMessage("Please blink your eyes...");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [imgSrc, mode]);

    return (
        <div className="face-capture-container">
            <style>{`
                /* Internal Critical Styles */
                .capture-controls {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    gap: 15px !important;
                    margin-top: 20px !important;
                    width: 100% !important;
                }
                
                .capture-controls button {
                    width: auto !important;
                    flex: 0 1 auto !important;
                    min-width: 120px !important;
                    border-radius: 50px !important;
                    padding: 10px 24px !important;
                }

                /* Matrix Scanner Animation */
                .scanner-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 20, 0, 0.4);
                    z-index: 999;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 12px;
                }

                .scanner-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: #00ff00;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.9);
                    animation: scanDown 1.5s linear infinite;
                }

                .scanner-grid {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px);
                    background-size: 40px 40px;
                    z-index: 1;
                }

                @keyframes scanDown {
                    0% { top: -10%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }

                .processing-text {
                    color: #00ff00;
                    font-family: monospace;
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-shadow: 0 0 10px #00ff00;
                    animation: blink 0.5s infinite alternate;
                    z-index: 2;
                }

                @keyframes blink {
                    from { opacity: 1; }
                    to { opacity: 0.5; }
                }
            `}</style>

            <h3 className="section-title">
                {mode === 'register' ? 'Register Face ID' : 'Face Verification'}
            </h3>

            <div className="webcam-wrapper" style={{ position: 'relative' }}>
                {imgSrc ? (
                    <div className="captured-view" style={{ position: 'relative' }}>
                        <img src={imgSrc} alt="captured face" className="captured-image" style={{ width: '100%', borderRadius: '12px' }} />

                        {/* Always show scanner if loading */}
                        {loading && (
                            <div className="scanner-container">
                                <div className="scanner-grid"></div>
                                <div className="scanner-line"></div>
                                <p className="processing-text">SCANNING ID...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={videoConstraints}
                        className="webcam-video"
                        onUserMediaError={(e) => setLivenessMessage("Camera access denied")}
                    />
                )}

                {/* Overlay for face positioning */}
                {!imgSrc && (
                    <div className="face-overlay">
                        <div className="face-guide-circle"></div>
                        <p className="liveness-hint">{livenessMessage}</p>
                    </div>
                )}
            </div>

            <div className="capture-controls">
                {imgSrc ? (
                    <>
                        <button className="btn btn-secondary" onClick={retake} disabled={loading}>Retake</button>
                        <button className="btn btn-primary" onClick={confirm} disabled={loading}>
                            {loading ? 'Verifying...' : 'Confirm Use'}
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-secondary" onClick={onBack}>Cancel</button>
                        <button className="btn btn-primary" onClick={capture}>Capture Photo</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FaceCapture;
