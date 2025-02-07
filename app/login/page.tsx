'use client'
import React, { useState } from 'react';
import TextInput from '../components/textInput';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleemailChange = (e: React.ChangeEvent<HTMLInputElement>) => setemail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { email, password };

    console.log("Form data to submit:", formData);

    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        let responseJson, userId, useremail;
        try {
          responseJson = await response.json();
          userId = responseJson.user.id;
          useremail = responseJson.user.email;
          // console.log(responseJson);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          alert("Error parsing server response. Please try again.");
          return;
        }

        console.log("Login successful:", userId);
        setemail("");
        setPassword("");
        alert("Login successful!");

        router.push(`/${userId}`); // Direct navigation to the user-specific page
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert("Login failed: " + errorData.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form. Please try again later.");
    }
  };

  const handleLoginWithOtp = () => {
    router.push('/otpLogin');
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div className="card-body">
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
          >
            Register
          </button>

          <h3 className="card-title text-center mb-4" style={{ fontSize: '22px' }}>Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <TextInput name="Email" value={email}  onChange={handleemailChange} />
            </div>

            <div className="mb-3">
              <TextInput name="Password" value={password} onChange={handlePasswordChange} />
            </div>

            <div style={styles.buttonContainer}>
              <button style={styles.button} type="submit">Login</button>
              <button style={styles.button} onClick={handleLoginWithOtp}>Login with OTP?</button>
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
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
    width: '100%',
    position: 'relative' as 'relative',
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