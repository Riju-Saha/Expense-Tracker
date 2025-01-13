"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams(); // Access route params
  const userId = params?.userId || 'Guest'; // Fallback to 'Guest' if userId is missing
  const [userName, setUserName] = useState(''); // State to store username
  const [error, setError] = useState(null); // State to store any errors

  // Fetch user details from the backend
  const getDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/details/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseJson = await response.json();
        setUserName(responseJson.user.name); // Update username state
      } else {
        const errorData = await response.json();
        console.error('Error fetching user:', errorData.error);
        setError(errorData.error); // Update error state
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    if (userId !== 'Guest') {
      getDetails();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">
          Welcome, {userName || `User ${userId}`}!
        </h1>
        {error && (
          <p className="text-red-500 mt-2">
            Error: {error}
          </p>
        )}
      </div>
    </>
  );
}
