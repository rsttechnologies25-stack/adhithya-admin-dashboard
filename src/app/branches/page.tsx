"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    MapPin, Phone, Mail, Clock, Star, Edit, Trash2, Plus, X, Search, MoreHorizontal, LayoutGrid
} from "lucide-react";
import toast from "react-hot-toast";

interface Branch {
    id: string;
    slug: string;
    name: string;
    area: string;
    address: string;
    description: string;
    phone: string;
    email: string;
    openingTime: string;
    closingTime: string;
    workingDays: string;
    imageUrl: string;
    avgRating: number;
    reviewCount: number;
    isActive: boolean;
}

export default function BranchManagementPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        area: "",
        address: "",
        description: "",
        phone: "",
        email: "",
        googleMapsEmbed: "",
        openingTime: "09:00",
        closingTime: "21:00",
        workingDays: "Mon-Sun",
        imageUrl: "",
        isActive: true
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const res = await api.get("/branches");
            setBranches(res.data);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
            toast.error("Failed to load branches");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (branch: Branch | null = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                area: branch.area,
                address: branch.address,
                description: branch.description || "",
                phone: branch.phone || "",
                email: branch.email || "",
                googleMapsEmbed: "", // Not returned by findAll usually unless requested
                openingTime: branch.openingTime || "09:00",
                closingTime: branch.closingTime || "21:00",
                workingDays: branch.workingDays || "Mon-Sun",
                imageUrl: branch.imageUrl || "",
                isActive: branch.isActive
            });
        } else {
            setEditingBranch(null);
            setFormData({
                name: "",
                area: "",
                address: "",
                description: "",
                phone: "",
                email: "",
                googleMapsEmbed: "",
                openingTime: "09:00",
                closingTime: "21:00",
                workingDays: "Mon-Sun",
                imageUrl: "",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await api.patch(`/branches/${editingBranch.id}`, formData);
                toast.success("Branch updated successfully");
            } else {
                await api.post("/branches", formData);
                toast.success("Branch created successfully");
            }
            setShowModal(false);
            fetchBranches();
        } catch (error) {
            console.error("Error saving branch:", error);
            toast.error("Failed to save branch");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;
        try {
            await api.delete(`/branches/${id}`);
            toast.success("Branch deleted successfully");
            fetchBranches();
        } catch (error) {
            console.error("Error deleting branch:", error);
            toast.error("Failed to delete branch");
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '14px',
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: '#4b5563',
        marginBottom: '6px'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#111827' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 750, margin: 0, letterSpacing: '-0.02em' }}>Branch Management</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage store locations and showrooms</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        backgroundColor: '#dc2626', color: 'white', borderRadius: '12px',
                        fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)'
                    }}
                >
                    <Plus size={18} /> Add New Branch
                </button>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={cardStyle}>
                    <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>Total Branches</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>{branches.length}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                        Average Rating
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {branches.length > 0 ? (branches.reduce((acc, b) => acc + b.avgRating, 0) / branches.length).toFixed(1) : "0.0"}
                        <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 400 }}>/ 5.0</span>
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>Total Reviews</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>
                        {branches.reduce((acc, b) => acc + b.reviewCount, 0)}
                    </div>
                </div>
            </div>

            {/* Branch Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#6b7280' }}>Loading branches...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {branches.map(branch => (
                        <div key={branch.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ height: '200px', width: '100%', backgroundColor: '#f3f4f6', overflow: 'hidden', position: 'relative' }}>
                                {branch.imageUrl ? (
                                    <img src={branch.imageUrl} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                        <MapPin size={48} />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 14px', backgroundColor: 'rgba(220, 38, 38, 0.9)', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                                    {branch.area}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{branch.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                                        <Star size={14} fill="#f59e0b" />
                                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{branch.avgRating.toFixed(1)}</span>
                                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>({branch.reviewCount})</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                                        <MapPin size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{branch.address}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                                        <Phone size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
                                        <span>{branch.phone}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                                        <Mail size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
                                        <span>{branch.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                                        <Clock size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
                                        <span>{branch.openingTime} - {branch.closingTime} ({branch.workingDays})</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                    <button
                                        onClick={() => handleOpenModal(branch)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch.id)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px',
                        maxHeight: '90vh', overflowY: 'auto', padding: '40px', position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '24px', fontWeight: 750, marginBottom: '8px' }}>{editingBranch ? "Edit Branch" : "Add New Branch"}</h2>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>Fill in the details below to {editingBranch ? "update the" : "create a new"} showroom location.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Branch Name</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Adhithya Electronics - Kolathur"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Area</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    required
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    placeholder="e.g. Kolathur"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="e.g. +91 9962466888"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Email ID</label>
                                <input
                                    style={inputStyle}
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="e.g. kolathur@adhithya.com"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Image URL</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="Upload or paste image link"
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Full Address</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Full showroom address including city and pincode"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Opening Time</label>
                                <input
                                    style={inputStyle}
                                    type="time"
                                    value={formData.openingTime}
                                    onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Closing Time</label>
                                <input
                                    style={inputStyle}
                                    type="time"
                                    value={formData.closingTime}
                                    onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Working Days</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    value={formData.workingDays}
                                    onChange={e => setFormData({ ...formData, workingDays: e.target.value })}
                                    placeholder="e.g. Mon-Sun"
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 1' }}>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" style={{ ...labelStyle, marginBottom: 0 }}>Active / Live on site</label>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Google Maps Embed Code (Optional)</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                                    value={formData.googleMapsEmbed}
                                    onChange={e => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
                                    placeholder="Paste the <iframe> code from Google Maps share menu"
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#dc2626', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)' }}
                                >
                                    {editingBranch ? "Update Branch" : "Create Branch"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
