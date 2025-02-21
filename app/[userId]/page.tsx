"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Transaction from '../components/transactionForm';
import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const userId = Array.isArray(params?.userId) ? params.userId[0] : params?.userId || 'Guest';

  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

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
        setUserName(responseJson.user.name);
      } else {
        const errorData = await response.json();
        console.error('Error fetching user:', errorData.error);
        setError(errorData.error);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  useEffect(() => {
    if (userId !== 'Guest') {
      getDetails();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 bg-gray-900 text-white text-center md:text-left bg-gray-900">
        <h1 className="text-2xl font-bold">
          Welcome, {userName || `User ${userId}`}!
        </h1>
        {error && (
          <p className="text-red-500 mt-2">
            Error: {error}
          </p>
        )}
      </div>
      <Transaction userId={userId} /> 
      {/* userName is not passed through props. It has been fetched by userId from the users table from database. 
      sql triggers added for this */}
    </>
  );
}
