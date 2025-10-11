import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading profile...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Avatar Circle */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white w-20 h-20 flex items-center justify-center rounded-full text-3xl font-bold shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Name and Email */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {profile.name || "Unknown User"}
        </h2>
        <p className="text-gray-500 mb-6">{profile.email}</p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* User Details (add more if needed) */}
        <div className="text-left space-y-3">
          <p>
            <strong className="text-gray-700">Joined:</strong>{" "}
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong className="text-gray-700">Role:</strong>{" "}
            {profile.role || "User"}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
