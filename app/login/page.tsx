'use client'
import React, { useEffect, useState } from 'react';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';
import { handleLogout } from '../Auth_utils/logout';
import { handleLogin } from '../Auth_utils/login';


export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleemailChange = (e: React.ChangeEvent<HTMLInputElement>) => setemail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form data to submit:", { email, password });

    const result = await handleLogin(email, password);

    if (result.success) {
      setemail("");
      setPassword("");
      alert("Login successful!");
      router.push(`/${result.userId}`);
    } else {
      alert("Login failed: " + result.error);
    }
  };

  const handleLoginWithOtp = () => {
    router.push('/otpLogin');
  };

  // need to make sure before login that all tokens are destroyed of previous users
  // also to make sure other cant access someones data from login page by hitting that url
  useEffect(() => {
    (async () => {
      await handleLogout();
    })();
  }, []);


  const handleForgetPassword = () => {
    // alert("link activated");
    router.push('/changePassword')
  }



  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div className="card-body">
          <button
            onClick={() => window.location.href = '/'}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}>Expense Tracker
          </button>

          <button
            onClick={() => window.location.href = '/register'} // Redirect to login page
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
          >Register
          </button>

          <h3 className="card-title text-center mb-4" style={{ fontSize: '22px' }}>Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <TextInput name="Email" type='email' value={email} onChange={handleemailChange} />
            </div>

            <div className="mb-3">
              <TextInput name="Password" type='password' value={password} onChange={handlePasswordChange} />
            </div>

            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={handleLoginWithOtp}>Login with OTP?</button>
              <button style={styles.button} type="submit">Login</button>
              <a onClick={handleForgetPassword} style={{cursor: 'pointer'}}>Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px',
    marginTop: '20px',
    width: '100%',
    position: 'relative' as 'relative',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#333',
    color: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '600px',
    padding: '27px',
    margin: '0 20px',
  },
  container: {
    backgroundColor: '#212121',
    color: '#e8e8e8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }
};