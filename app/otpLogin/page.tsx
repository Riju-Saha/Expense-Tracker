'use client';
import React, { useState } from 'react';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';
import { handleOtpLogin, handleOtpSent } from '../Auth_utils/otp_service';
// import { handleOtpSent } from '../Auth_utils/otp_sent';

export default function OtpLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOtp = [...otp];
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };


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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button
          onClick={() => window.location.href = '/register'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#f5f5f5',
            color: 'black',
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
        <h3 className="card-title text-center mb-4" style={{ fontSize: '22px' }}>Login</h3>
        <form onSubmit={handleSubmit}>
          <TextInput name="Email" type = 'email' value={email} onChange={handleEmailChange} />
          <div className='mb-2 mt-2' style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={styles.button} type='button' onClick={handleOtpRequest}>Send Otp</button>
          </div>
          <div style={styles.otp_container}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                maxLength={1}
                placeholder="-"
                style={styles.otp_input_box}
                aria-label={`OTP Digit ${index + 1}`}
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
  );
}

const styles = {
  otp_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  otp_input_box: {
    width: '40px',
    height: '40px',
    textAlign: 'center' as 'center',
    fontSize: '24px',
    backgroundColor: '#333',
    color: '#f5f5f5',
    border: '1px solid #555',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  otp_input_box_focus: {
    borderColor: '#4A90E2',
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