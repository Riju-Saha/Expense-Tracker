import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="bg-gray-100 border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    <a className="text-lg font-semibold text-gray-800 dark:text-white" href="#">
      Navbar
    </a>
        <button
      className="block lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none ml-auto"
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
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-4 w-full lg:w-auto`}
          id="navbarSupportedContent"
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-4 w-full lg:w-auto">
            <li>
              <a
                className="block px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                href="#"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                href="#"
              >
                Link
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
