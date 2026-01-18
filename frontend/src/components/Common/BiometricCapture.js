import React, { useState, useRef } from 'react';
import '../../styles/components.css';

const BiometricCapture = ({ type, onCapture, onBack, verifyMode = false }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const simulateCapture = () => {
    setIsCapturing(true);
    
    // Simulate capture process
    setTimeout(() => {
      setIsCapturing(false);
      setCaptured(true);
      
      // Generate mock biometric data
      const mockData = type === 'face' 
        ? `face_data_${Date.now()}`
        : `finger_data_${Date.now()}`;
      
      // Callback with captured data
      setTimeout(() => {
        onCapture(mockData);
      }, 1000);
    }, 2000);
  };

  const getBiometricTitle = () => {
    if (verifyMode) {
      return type === 'face' ? 'Face Verification' : 'Fingerprint Verification';
    }
    return type === 'face' ? 'Face Capture' : 'Fingerprint Capture';
  };

  const getBiometricDescription = () => {
    if (verifyMode) {
      return type === 'face' 
        ? 'Please look at the camera to verify your identity'
        : 'Please place your finger on the scanner to verify your identity';
    }
    return type === 'face' 
      ? 'We need to capture your face for secure authentication'
      : 'We need to capture your fingerprint for secure authentication';
  };

  const getInstructions = () => {
    if (type === 'face') {
      return [
        'Ensure good lighting',
        'Look directly at the camera',
        'Remove sunglasses or hats',
        'Keep a neutral expression'
      ];
    } else {
      return [
        'Clean your finger before scanning',
        'Place your finger flat on the scanner',
        'Apply gentle pressure',
        'Keep your finger still during capture'
      ];
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{getBiometricTitle()}</h2>
      
      <div className="biometric-container">
        <p className="biometric-description">{getBiometricDescription()}</p>

        {/* Capture Preview */}
        <div className="biometric-preview">
          {type === 'face' ? (
            <div className="face-preview">
              {isCapturing ? (
                <div className="capture-animation">
                  <div className="scan-line"></div>
                  <p>Capturing...</p>
                </div>
              ) : captured ? (
                <div className="capture-success">
                  <div className="success-icon">✓</div>
                  <p>Capture Successful!</p>
                </div>
              ) : (
                <div className="face-placeholder">
                  <div className="camera-icon">📷</div>
                  <p>Camera Preview</p>
                </div>
              )}
            </div>
          ) : (
            <div className="fingerprint-preview">
              {isCapturing ? (
                <div className="capture-animation">
                  <div className="fingerprint-scan"></div>
                  <p>Scanning...</p>
                </div>
              ) : captured ? (
                <div className="capture-success">
                  <div className="success-icon">✓</div>
                  <p>Scan Successful!</p>
                </div>
              ) : (
                <div className="fingerprint-placeholder">
                  <div className="fingerprint-icon">👆</div>
                  <p>Fingerprint Scanner</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="biometric-instructions">
          <h4>Instructions:</h4>
          <ul>
            {getInstructions().map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="biometric-actions">
          {!captured && !isCapturing && (
            <button 
              className="btn btn-primary"
              onClick={simulateCapture}
            >
              Start {verifyMode ? 'Verification' : 'Capture'}
            </button>
          )}

          {isCapturing && (
            <button className="btn btn-secondary" disabled>
              <div className="spinner"></div>
              Capturing...
            </button>
          )}

          {captured && (
            <div className="capture-complete">
              <p className="success-text">
                {verifyMode ? 'Verification Complete!' : 'Capture Complete!'}
              </p>
              <p>Redirecting...</p>
            </div>
          )}

          {onBack && (
            <button 
              className="btn btn-secondary"
              onClick={onBack}
              style={{ marginTop: '1rem' }}
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Hidden canvas for actual capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default BiometricCapture;