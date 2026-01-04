"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Star } from "lucide-react";
import Link from "next/link";

export default function CreateTestimonialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
        avatarUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/testimonials", formData);
            router.push("/testimonials");
        } catch (error) {
            console.error("Failed to create testimonial:", error);
            alert("Failed to create testimonial.");
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
                <Link href="/testimonials" style={{ color: '#6b7280', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Create Testimonial</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Customer Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Role / Industry</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Business Owner"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Rating *</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Quote Content *</label>
                            <textarea
                                name="content"
                                required
                                value={formData.content}
                                onChange={handleChange}
                                rows={4}
                                style={inputStyle}
                                placeholder="What did the customer say?"
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Avatar URL (Optional)</label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Link href="/testimonials" style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', color: '#374151', textDecoration: 'none' }}>
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 24px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                    >
                        <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {loading ? "Saving..." : "Save Testimonial"}
                    </button>
                </div>
            </form>
        </div>
    );
}
