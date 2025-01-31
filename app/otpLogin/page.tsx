'use client'
import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';

export default function OtpLogin() {
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOtp = [...otp];
    const value = e.target.value;

    if (value && !/^\d$/.test(value)) {
      return;
    }

    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpSent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 1) {
      try {
        const response = await fetch('http://localhost:8000/api/users/userCheck', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (response.ok) {
          alert('Check your email for the OTP.');
        } else {
          const errorData = await response.json();
          alert(errorData.message || "This name doesn't exist.");
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Something went wrong. Please try again later.');
      }
    } else {
      alert('Kindly provide a valid name first.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, otp }),
      });

      if (response.ok) {
        const responseJson = await response.json();
        const userId = responseJson.user.id;
        setName('');
        setOtp(['', '', '', '', '', '']);
        alert('Login successful!');
        router.push(`/${userId}`);
      } else {
        const errorData = await response.json();
        alert('Login failed: ' + errorData.error);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again later.');
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
          <TextInput name="Name" value={name} onChange={handleNameChange} />
          <div className='mb-2 mt-2' style={{ display: 'flex', justifyContent: 'center' }}>
                            <button style={styles.button} type='button' onClick={handleOtpSent}>Sent Otp</button>
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
        backgroundColor: '#212121', // Dark background for the card
        color: '#f5f5f5', // Light text color
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '600px',
        padding: '27px',
        margin: '0 20px',
    },
    container: {
        backgroundColor: '#121212', // Darker background for the container
        color: '#e8e8e8', // Light text color
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center', // Center the buttons horizontally
        gap: '10px', // Add space between the buttons
        marginTop: '20px', // Add some space above buttons
        width: '100%',
        position: 'relative' as 'relative',
    },
};
