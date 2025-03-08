'use client'
import React, { useEffect, useState } from 'react';
import TextInput from '../components/textInput';
import { handleLogout } from '../Auth_utils/logout';
import { handleRegister } from '../Auth_utils/regsiter';
import useAutoLogout from '../Auth_utils/useAutoLogout';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleemailChange = (e: React.ChangeEvent<HTMLInputElement>) => setemail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const result = await handleRegister(name, email, password, phone);
  
    if (result.success) {
      alert("Registered successfully!");
      setName("");
      setemail("");
      setPassword("");
      setPhone("");
      window.location.href = '/login';
    } else {
      alert(result.error);
    }
  };
  
  useAutoLogout();

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div className="card-body">
            <button
              onClick={() => window.location.href = '/'} // Redirect to home page
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Expense Tracker
            </button>
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
                <TextInput name="Name" value={name} onChange={handleNameChange} type='text' />
              </div>

              <div className="mb-3">
                <TextInput name="email" value={email} onChange={handleemailChange} type='email' />
              </div>

              <div className="mb-3">
                <TextInput name="Password" value={password} onChange={handlePasswordChange} type='password' />
              </div>

              <div className="mb-3">
                <TextInput name="Phone" value={phone} onChange={handlePhoneChange} type='tel' />
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