"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Globe } from "lucide-react";
import Link from "next/link";

export default function CreatePartnerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        websiteUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/partners", formData);
            router.push("/partners");
        } catch (error) {
            console.error("Failed to create partner:", error);
            alert("Failed to create partner.");
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/partners" style={{ color: '#6b7280', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Add Partner Brand</h1>
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
                                placeholder="Sony, Samsung, etc."
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
                                placeholder="https://example.com/logo.png"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Website URL (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <Globe size={16} style={{ position: 'absolute', left: '12px', top: '21px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    name="websiteUrl"
                                    value={formData.websiteUrl}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, paddingLeft: '36px' }}
                                    placeholder="https://sony.com"
                                />
                            </div>
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
                        {loading ? "Saving..." : "Save Partner"}
                    </button>
                </div>
            </form>
        </div>
    );
}
