'use client';
import React, { useState, useRef, useEffect } from 'react';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';
import { handleOtpLogin, handleOtpSent } from '../Auth_utils/otp_service';
import { handleLogout } from '../Auth_utils/logout';
import useAutoLogout from '../Auth_utils/useAutoLogout';

export default function OtpLogin() {
  const [email, setEmail] = useState("");
  const length = 6; // Set OTP length
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setRef = (el: HTMLInputElement | null, index: number) => {
    if (el) inputRefs.current[index] = el;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await handleOtpSent(email);

    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      alert('Check your email for the OTP.');
    } else {
      alert(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    const result = await handleOtpLogin(email, otpString);

    if (result.success) {
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      alert('Login successful!');
      router.push(`/${result.userId}`);
    } else {
      if (result.error === 'Invalid OTP') {
        alert('Incorrect OTP, check again.');
      } else {
        alert('Login failed: ' + result.error);
      }
    }
  };

  const handleLoginWithPassword = () => {
    router.push('/login');
  };

  useAutoLogout();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div className="card-body">
          <button
            onClick={() => window.location.href = '/'}
            style={styles.home_button as React.CSSProperties}>Expense Tracker
          </button>

          <button
            onClick={() => window.location.href = '/register'}
            style={styles.register_button as React.CSSProperties}>Register
          </button>

          <h3 className="card-title text-center mb-4" style={{ fontSize: '22px' }}>Login</h3>

          <form onSubmit={handleSubmit}>
            <TextInput name="Email" type='email' value={email} onChange={handleEmailChange} />
            <div className='mb-2 mt-2' style={{ display: 'flex', justifyContent: 'center' }}>
              <button style={styles.button} type='button' onClick={handleOtpRequest}>Send Otp</button>
            </div>

            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              Enter OTP: {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => setRef(el, index)}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border border-gray-500 rounded-md bg-gray-900 text-white focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            <div style={styles.buttonContainer}>
              <button style={styles.button} type="submit">Login</button>
              <button style={styles.button} type="button" onClick={handleLoginWithPassword}>
                Login with password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  register_button: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#f5f5f5',
    color: 'black',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },

  home_button: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',

  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  card: {
    backgroundColor: '#212121',
    color: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '600px',
    padding: '27px',
    margin: '0 20px',
  },
  container: {
    backgroundColor: '#121212',
    color: '#e8e8e8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
    width: '100%',
    position: 'relative' as 'relative',
  },
};