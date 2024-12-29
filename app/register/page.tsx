'use client'
import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../components/textInput';


export default function Register() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, email, password };
  
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
        alert("Registered sucessfully!")
        setName("");
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert('Error submitting form. Please try again later.');
    }
  };

  return (
    <Container>
      <Card>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <TextInput name="Name" value={name} onChange={handleNameChange} />
            </div>

            <div className="mb-3">
              <TextInput name="Email" value={email} onChange={handleEmailChange} />
            </div>

            <div className="mb-3">
              <TextInput name="Password" value={password} onChange={handlePasswordChange} />
            </div>

            <div className="mb-3" style={{ width: '20%', backgroundColor: 'white', color: 'black', margin: 'auto', textAlign: 'center' }}>
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  background-color: #212121;
  color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Card = styled.div`
  background-color: #333;
  color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  padding: 27px;
  margin: 0 20px;
`;
