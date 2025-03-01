"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Transaction from '../components/transactionForm';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params?.userId) ? params.userId[0] : params?.userId || 'Guest';

  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  // Fetch user details from the backend
  const getDetails = async () => {
    try {
      console.log("Fetching details for user:", userId);

      const response = await fetch(`http://localhost:8000/api/users/details/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const responseJson = await response.json();
        console.log("Fetched user details:", responseJson.user);
        setUserName(responseJson.user.name);
      } else {
        const errorData = await response.json();
        console.error('Error fetching user:', errorData.error);
        setError(errorData.error);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  useEffect(() => {
    if (userId !== 'Guest' && !userName) {
      getDetails();
    }
  }, [userId, userName]);

  // useEffect(() => {
  //   window.onpopstate = async (event) => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/users/logout', {
  //         method: 'POST',
  //         credentials: 'include',
  //       });

  //       if (response.ok) {
  //         console.log('Logout successful');
  //       } else {
  //         console.error('Logout failed');
  //       }
  //     } catch (err) {
  //       console.error('Error during logout:', err);
  //     }

  //     router.push('/login');
  //   };
  // }, []);

  useEffect(() => {
    window.onpopstate = (event) => {
      router.push('/login');
    }
  }, []);


  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 bg-gray-900 text-white text-center md:text-left bg-gray-900">
        <h1 className="text-2xl font-bold">
          {userName ? `Welcome, ${userName}!` : `Welcome, User ${userId}`}
        </h1>
        {error && (
          <p className="text-red-500 mt-2">
            Error: {error}
          </p>
        )}
      </div>

      {userName ? (
        <Transaction userId={userId} />
      ) : (
        <p className="text-red-500 text-center mt-4">Unauthorized Access</p>
      )}
    </>
  );
}
