// src/pages/ProfileAdmin.jsx
import { useEffect, useState } from "react";
import { User, Phone, Mail, Edit2, Users, Grid2X2 } from "lucide-react";
import { getToken } from "../../utils/utils";

export default function ProfileAdmin() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}api/user`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const data = await res.json();
                setProfile(data.own_profile);
                console.log(data)
            } catch (err) {
                console.error("Gagal fetch profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleNavigate = (path) => {
        window.location.href = path; // pindah page
    };

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="w-full bg-white px-8 pt-8">
                <h1 className="text-lg font-semibold">Marketplace Admin Portal</h1>
                <p className="text-sm text-gray-500">
                    Manage your profile, accounts, and product categories
                </p>
            </div>

            {/* Tabs */}
            <div className="mt-3 px-8">
                <div className="bg-gray-200 rounded-full p-1 flex items-center gap-2 w-fit">
                    <button
                        onClick={() => handleNavigate("/profile")}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-white shadow-sm text-black"
                    >
                        <User size={16} /> Profile
                    </button>

                    <button
                        onClick={() => handleNavigate("/allaccount")}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        <Users size={16} /> All Account
                    </button>

                    <button
                        onClick={() => handleNavigate("/categories")}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        <Grid2X2 size={16} /> Categories
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="mt-6 px-8">
                <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div className="flex items-center gap-6 mt-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ) : profile ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">My Profile</p>
                                    <p className="text-xs text-gray-400">
                                        View and manage your admin account information
                                    </p>
                                </div>
                                <button
                                    onClick={() => alert("Tombol Edit Profile diklik!")}
                                    className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center gap-2"
                                >
                                    <Edit2 size={14} /> Edit Profile
                                </button>
                            </div>

                            <div className="flex justify-start gap-16 items-start">
                                {/* Left info */}
                                <div className="flex items-start gap-6">
                                    <img
                                        src={profile.image || 
                                            "default.png"}
                                        alt="profile"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="mb-4">
                                            <div className="flex items-center text-sm font-medium mb-1">
                                                <User size={14} className="mr-2 text-gray-600" />
                                                Name
                                            </div>
                                            <p className="text-gray-700 text-sm">{profile.name}</p>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center text-sm font-medium mb-1">
                                                <Phone size={14} className="mr-2 text-gray-600" />
                                                Phone
                                            </div>
                                            <p className="text-gray-700 text-sm">{profile.phone_number}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium mb-1">Permissions</p>
                                            <p className="text-gray-700 text-sm">Full Access</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right info */}
                                <div className="text-sm">
                                    <div className="flex items-center text-sm font-medium mb-1">
                                        <Mail size={14} className="mr-2 text-gray-600" />
                                        Email
                                    </div>
                                    <p className="text-gray-700 text-sm mb-4">{profile.email}</p>

                                    <p className="text-sm font-medium mb-1">Account Type</p>
                                    <p className="text-gray-700 text-sm">{profile.role}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Profile not found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
