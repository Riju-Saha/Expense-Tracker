'use client'
import React, { useState } from 'react';
import TextInput from '../components/textInput';

export default function Register() {
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before sending to the backend
    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    const formData = { name, Email, password, phone };
    console.log("Form data to submit:", formData);

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        alert("Registered successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        if (errorData.error.includes('name and Email')) {
          alert('The name and Email are already registered. Please try another.');
        } else if (errorData.error.includes('name')) {
          alert('The name is already registered. Please choose another name.');
        } else if (errorData.error.includes('Email')) {
          alert('The Email is already registered. Please use another Email.');
        } else if (errorData.error.includes('Phone number')) {
          alert(errorData.error);
        } else {
          alert('Registration failed. Please try again.');
        }
        console.error("Registration failed:", errorData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert('Error submitting form. Please try again later.');
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div className="card-body">
            <button
              onClick={() => window.location.href = '/login'} // Redirect to login page
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
              Login
            </button>

            <h3 className="card-title text-center mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <TextInput name="Name" type="text" value={name} onChange={handleNameChange} />
              </div>

              <div className="mb-3">
                <TextInput name="Email" type="email" value={Email} onChange={handleEmailChange} />
              </div>

              <div className="mb-3">
                <TextInput name="Password" type="password" value={password} onChange={handlePasswordChange} />
              </div>

              <div className="mb-3">
                <TextInput name="Phone" type="text" value={phone} onChange={handlePhoneChange} />
              </div>

              <div style={{ margin: 'auto', width: '20%' }}>
                <button style={styles.button} type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
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
}