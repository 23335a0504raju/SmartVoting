import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/components.css';
import { generateCaptcha } from '../../utils/auth';

const Captcha = ({ onValidate }) => {
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  const onValidateRef = useRef(onValidate);

  useEffect(() => {
    onValidateRef.current = onValidate;
  }, [onValidate]);

  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setUserInput('');
    setIsValid(null);
    if (onValidateRef.current) onValidateRef.current(false);
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const validateCaptcha = () => {
    const valid = userInput === captcha;
    setIsValid(valid);
    if (onValidateRef.current) onValidateRef.current(valid);
    return valid;
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setIsValid(null);
    if (onValidateRef.current) onValidateRef.current(false);
  };



  return (
    <div className="captcha-container">
      <div className="captcha-header">
        <h4>Security Verification</h4>
        <button
          type="button"
          onClick={refreshCaptcha}
          className="refresh-captcha"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="captcha-display">
        <div className="captcha-text">{captcha}</div>
      </div>

      <div className="captcha-form">
        <div className="form-group">
          <label className="form-label">Enter the text above</label>
          <input
            type="text"
            className="form-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the characters you see"
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                validateCaptcha();
              }
            }}
          />
        </div>

        {isValid === false && (
          <div className="error-message">
            Captcha verification failed. Please try again.
          </div>
        )}

        {isValid === true && (
          <div className="success-message">
            ✓ Captcha verified successfully!
          </div>
        )}

        <button
          type="button"
          onClick={validateCaptcha}
          className="btn btn-secondary"
          style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        >
          Verify Captcha
        </button>
      </div>
    </div>
  );
};

export default Captcha;