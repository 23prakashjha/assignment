import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Simulate a quick check delay for better UX
    setTimeout(() => {
      setIsAuthenticated(!!token);
      setChecking(false);
    }, 400);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied 🚫
          </h2>
          <p className="text-gray-600 mb-6">
            You need to <strong>log in</strong> to access this page.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
}
