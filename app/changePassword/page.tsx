'use client';
import React, { useEffect, useState, useRef } from 'react';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';
import { handleVerifyOtpLogin, handleOtpSent } from '../Auth_utils/otp_service';
import { handleLogout } from '../Auth_utils/logout';
import useAutoLogout from '../Auth_utils/useAutoLogout';

export default function ChangePassword() {
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const length = 6; // Set OTP length
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const [otpSent, isOtpSent] = useState(false);

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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleOtpRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await handleOtpSent(email);

        if (result.success) {
            setOtp(['', '', '', '', '', '']);
            isOtpSent(true);
            alert('Check your email for the OTP.');
        } else {
            alert(result.error);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');

        const result = await handleVerifyOtpLogin(email, otpString);

        if (result.success) {
            alert('Verification successful!');
            setIsVerified(true);
        } else {
            alert(result.error === 'Invalid OTP' ? 'Incorrect OTP, check again.' : 'Login failed: ' + result.error);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const response = await fetch('http://localhost:8000/api/users/resetPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            alert('Password changed successfully! Redirecting to login page.');
            router.push('/login');
        } else {
            alert('Error: ' + data.error);
        }
    };

    // if the verification is not completed within 5 minutes, reset the OTP
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent) {
            timer = setTimeout(() => {
                isOtpSent(false);
                setOtp(new Array(length).fill(""));
            }, 300000); // 5 minutes in milliseconds
        }
        return () => clearTimeout(timer);
    }, [otpSent]);

    useAutoLogout();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div className="card-body">
                    <button
                        onClick={() => window.location.href = '/'}
                        style={styles.home_button as React.CSSProperties}>Expense Tracker
                    </button>

                    <h3 className="card-title text-center mb-4" style={{ fontSize: '22px' }}>
                        {isVerified ? 'Reset Password' : 'Email Verification'}
                    </h3>

                    {isVerified ? (
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-2">
                                <TextInput name="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div className="mt-2">
                                <TextInput name="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <div style={styles.buttonContainer}>
                                <button style={styles.button} type="submit">Change Password</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={otpSent ? handleVerify : handleOtpRequest}>
                            <TextInput name="Email" type="email" value={email} onChange={handleEmailChange} />

                            <div className="flex gap-2 mt-4" style={{ alignItems: 'center' }}>
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
                                <button style={styles.button} type="submit">
                                    {otpSent ? 'Verify OTP' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
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