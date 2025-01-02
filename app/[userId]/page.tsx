"use client";
import Navbar from '../components/Navbar';

import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams(); // Access route params
  const userId = params?.userId || 'Guest'; // Fallback to 'Guest' if userId is missing

  console.log("Received userId:", userId);

  return (
    <>
      <Navbar />
      <div>
        <h1>Welcome, User {userId}!</h1>
      </div>
    </>
  );
}
