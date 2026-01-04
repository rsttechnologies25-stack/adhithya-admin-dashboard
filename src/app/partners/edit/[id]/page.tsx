"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditPartnerPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        websiteUrl: "",
        isActive: true
    });

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                setFetching(true);
                const response = await api.get(`/partners/${id}`);
                const data = response.data;
                setFormData({
                    name: data.name || "",
                    logoUrl: data.logoUrl || "",
                    websiteUrl: data.websiteUrl || "",
                    isActive: data.isActive !== false
                });
            } catch (error) {
                console.error("Failed to fetch partner:", error);
                router.push("/partners");
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchPartner();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.put(`/partners/${id}`, formData);
            router.push("/partners");
        } catch (error) {
            console.error("Failed to update partner:", error);
            alert("Failed to update partner.");
        } finally {
            setLoading(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        padding: '24px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        marginTop: '6px',
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
    };

    if (fetching) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/partners" style={{ color: '#6b7280', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Edit Partner</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Partner Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Logo URL *</label>
                            <input
                                type="text"
                                name="logoUrl"
                                required
                                value={formData.logoUrl}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Website URL (Optional)</label>
                            <input
                                type="text"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                id="isActive"
                            />
                            <label htmlFor="isActive" style={labelStyle}>Active (Show in Brands Section)</label>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Link href="/partners" style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', color: '#374151', textDecoration: 'none' }}>
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 24px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                    >
                        <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {loading ? "Saving..." : "Update Partner"}
                    </button>
                </div>
            </form>
        </div>
    );
}
