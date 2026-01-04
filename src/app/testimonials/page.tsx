"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { MessageSquare, Plus, Search, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";

interface Testimonial {
    id: string;
    name: string;
    role: string | null;
    content: string;
    rating: number;
    isActive: boolean;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await api.get("/testimonials");
            setTestimonials(response.data || []);
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this testimonial from the home page?")) return;
        try {
            await api.delete(`/testimonials/${id}`);
            setTestimonials(testimonials.map(t => t.id === id ? { ...t, isActive: false } : t));
        } catch (error) {
            console.error("Failed to delete testimonial:", error);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Testimonials Management</h1>
                <Link
                    href="/testimonials/create"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                    }}
                >
                    <Plus size={18} />
                    Add Testimonial
                </Link>
            </div>

            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Customer</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Content</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Rating</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading testimonials...</td>
                            </tr>
                        ) : testimonials.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No testimonials found</td>
                            </tr>
                        ) : (
                            testimonials.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{t.name}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{t.role || "Customer"}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563', maxWidth: '300px' }}>
                                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.content}
                                        </p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600 }}>{t.rating}</span>
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            backgroundColor: t.isActive ? '#dcfce7' : '#fee2e2',
                                            color: t.isActive ? '#166534' : '#991b1b',
                                        }}>
                                            {t.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <Link href={`/testimonials/edit/${t.id}`} style={{ padding: '6px', borderRadius: '6px', color: '#4b5563' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                style={{ padding: '6px', borderRadius: '6px', color: '#dc2626', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
