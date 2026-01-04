"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User, Shield, Phone, Mail, Plus, Trash2, Edit2, Loader2 } from "lucide-react";

interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'ADMIN'
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password;
                await api.put(`/admin/users/${editingUser.id}`, updateData);
            } else {
                await api.post('/admin/users', formData);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'ADMIN' });
            fetchUsers();
        } catch (error) {
            alert("Action failed. Check console for details.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to remove this admin?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchUsers();
            } catch (error) {
                alert("Failed to delete user.");
            }
        }
    };

    const openEdit = (user: AdminUser) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || '',
            role: user.role
        });
        setIsModalOpen(true);
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        padding: '24px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Administrator Management</h1>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'ADMIN' });
                        setIsModalOpen(true);
                    }}
                    style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={18} /> Add New Admin
                </button>
            </div>

            <div style={cardStyle}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                        <Loader2 className="animate-spin" size={32} color="#dc2626" />
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '12px', color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>User</th>
                                    <th style={{ padding: '12px', color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>Contact</th>
                                    <th style={{ padding: '12px', color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>Role</th>
                                    <th style={{ padding: '12px', color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>Created</th>
                                    <th style={{ padding: '12px', color: '#6b7280', fontWeight: 500, fontSize: '14px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={16} color="#dc2626" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{user.firstName} {user.lastName}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {user.id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#374151' }}>
                                                    <Mail size={12} color="#9ca3af" /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#374151' }}>
                                                        <Phone size={12} color="#9ca3af" /> {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                backgroundColor: user.role === 'ADMIN' ? '#f0f9ff' : '#f5f3ff',
                                                color: user.role === 'ADMIN' ? '#0369a1' : '#5b21b6'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '13px', color: '#6b7280' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    style={{ padding: '6px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    <Edit2 size={14} color="#6b7280" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    style={{ padding: '6px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={14} color="#dc2626" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 20px' }}>
                            {editingUser ? 'Edit Administrator' : 'Add New Administrator'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                                    Password {editingUser && <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Leave blank to keep same)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="SUPPORT">SUPPORT</option>
                                        <option value="INVENTORY_MANAGER">INVENTORY_MANAGER</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '8px 16px', border: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '8px 16px', border: 'none', backgroundColor: '#dc2626', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
