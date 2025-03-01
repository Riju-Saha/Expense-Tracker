import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();



  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout successful');
        alert('Logged out successfully!');
        router.push('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };


  return (
    <nav className="bg-gray-100 border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Navbar title and menu */}
        <div className="flex items-center space-x-4">
          <a
            className="text-lg font-semibold text-gray-800 dark:text-white"
            href="#"
          >
            Expense Tracker
          </a>

        </div>

        {/* Logout button */}
        <div className="hidden lg:flex">
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="navbarSupportedContent"
        >
          <svg
            className="h-6 w-6 transition-transform transform"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Links and Logout - visible on mobile */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } lg:hidden w-full mt-3`}
          id="navbarSupportedContent"
        >
          <ul className="flex flex-col space-y-2">
            <li>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
