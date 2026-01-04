"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { LayoutGrid, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;

            if (user.role === 'CUSTOMER') {
                setError('Access denied. Administrators only.');
                setLoading(false);
                return;
            }

            login(access_token, user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#dc2626',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <LayoutGrid color="white" size={28} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Admin Dashboard</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Please enter your credentials to continue</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fee2e2',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#b91c1c',
                        fontSize: '14px'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@adhithya.com"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            opacity: loading ? 0.7 : 1,
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                    &copy; {new Date().getFullYear()} Adhithya Electronics. All rights reserved.
                </div>
            </div>
        </div>
    );
}
