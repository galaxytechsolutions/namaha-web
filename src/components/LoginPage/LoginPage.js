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

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [gmail, setGmail] = useState('');

  /* =====================================================
     SEND OTP (REAL + DUMMY FALLBACK)
  ===================================================== */
  const sendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setError('Enter valid 10-digit mobile');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post('/auth/send-otp', { mobile });

      if (res.data.success) {
        setStep(2);
        setError('OTP sent successfully');
      }
    } catch (err) {
      console.warn("⚠️ API not available — using dummy OTP");

      // 🔥 DUMMY SUCCESS
      setStep(2);
      setError('Demo Mode: Use OTP 000000');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     VERIFY OTP (REAL + DUMMY FALLBACK)
  ===================================================== */
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

      if (res.data.success) {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);

        if (res.data.isNewUser) {
          setStep(3);
        } else {
          navigate('/puja');
        }
      }
    } catch (err) {
      console.warn("⚠️ API verify failed — checking dummy OTP");

      // 🔥 DUMMY VERIFY
      if (otp === "000000") {
        const dummyToken = "dummy-jwt-token";
        localStorage.setItem("token", dummyToken);
        setToken(dummyToken);

        // simulate new user first time
        const isNewUser = !localStorage.getItem("profileCompleted");

        if (isNewUser) {
          setStep(3);
        } else {
          navigate('/puja');
        }
      } else {
        setError("Invalid OTP (Demo OTP = 000000)");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     COMPLETE PROFILE (REAL + DUMMY FALLBACK)
  ===================================================== */
  const completeProfile = async () => {
    if (!name || !dob || !gmail) {
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

      navigate('/');
    } catch (err) {
      console.warn("⚠️ API profile save failed — using dummy save");

      // 🔥 DUMMY SAVE
      localStorage.setItem("profileCompleted", "true");
      localStorage.setItem("userProfile", JSON.stringify({
        name,
        dob,
        zodiacSign,
        gmail
      }));

      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🛕 Sri aaum</div>
          <h1>Welcome Back</h1>
          <p>Enter your mobile to receive OTP</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {/* STEP 1 */}
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
            <button className="login-btn" onClick={sendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="login-form">
            <p>OTP sent to {mobile}</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              maxLength={6}
            />
            <button onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="login-form">
            <h3>Complete Profile</h3>

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            <input
              type="email"
              placeholder="Gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
            />

            <select value={zodiacSign} onChange={(e) => setZodiacSign(e.target.value)}>
              <option value="">Select Zodiac</option>
              <option value="aries">Aries</option>
              <option value="taurus">Taurus</option>
              <option value="gemini">Gemini</option>
            </select>

            <button onClick={completeProfile} disabled={loading}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default LoginPage;
