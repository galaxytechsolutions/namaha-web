import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/instance';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  // Profile fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [gmail, setGmail] = useState(''); 

  // Send OTP
  const sendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setError('Enter valid 10-digit mobile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/send-otp', { mobile });
      console.log('✅ OTP Response:', res.data);
      
      if (res.data.success) {
        setStep(2);
        setError('OTP sent successfully! (Use: 000000)');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { 
        mobile, 
        otp 
      });
      
      console.log('✅ Verify Response:', res.data);
      
      if (res.data.success) {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        
        if (res.data.isNewUser) {
          setStep(3);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Complete Profile - NOW INCLUDES GMAIL
  const completeProfile = async () => {
    if (!name || !dob || !token || !gmail) { 
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/complete-profile', {
        name,
        dob,
        zodiacSign,
        gmail 
      });
      
      console.log('✅ Profile Complete:', res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      console.error('❌ Error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🛕 Shri aaum</div>
          <h1>Welcome Back</h1>
          <p>Enter your mobile to receive OTP</p>
        </div>

        {error && (
          <div className="login-error">{error}</div>
        )}

        {/* STEP 1: Mobile */}
        {step === 1 && (
          <div className="login-form">
            <div className="login-input-group">
              <label>Mobile Number</label>
              <div className="login-phone-input">
                <span>+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  maxLength={10}
                />
              </div>
            </div>
            <button 
              className="login-btn" 
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div className="login-form">
            <div className="login-otp-header">
              <p>OTP sent to <strong>{mobile}</strong></p>
              <button className="login-resend" onClick={() => setStep(1)}>
                Change Number
              </button>
            </div>
            <div className="login-input-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button 
              className="login-btn" 
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {/* STEP 3: Profile */}
        {step === 3 && (
          <div className="login-form">
            <h3>Complete Your Profile</h3>
            <p>Create your devotee profile to continue</p>
            
            <div className="login-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="login-input-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            
            <div className="login-input-group">
              <label>Gmail Address *</label>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="yourname@gmail.com"
              />
            </div>
            
            <div className="login-input-group">
              <label>Zodiac Sign</label>
              <select value={zodiacSign} onChange={(e) => setZodiacSign(e.target.value)}>
                <option value="">Select Zodiac</option>
                <option value="aries">Aries (मेष)</option>
                <option value="taurus">Taurus (वृषभ)</option>
                <option value="gemini">Gemini (मिथुन)</option>
              </select>
            </div>
            
            <button 
              className="login-btn" 
              onClick={completeProfile}
              disabled={loading || !name || !dob || !gmail} 
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        )}

        <div className="login-footer">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
