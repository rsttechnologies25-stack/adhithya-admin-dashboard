"use client";

import { Search, Bell, Plus, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: '60px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px'
        }}>
            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '400px' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            paddingLeft: '40px',
                            paddingRight: '16px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px' }}>
                {/* User Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{user?.name}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{user?.role}</span>
                </div>

                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                }}>
                    <Bell size={20} color="#6b7280" />
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    title="Logout"
                    style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        transition: 'color 0.2s'
                    }}
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
