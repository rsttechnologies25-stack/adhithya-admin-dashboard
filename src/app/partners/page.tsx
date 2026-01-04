"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, Plus, Edit, Trash2, Globe } from "lucide-react";
import Link from "next/link";

interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
    isActive: boolean;
}

export default function PartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await api.get("/partners");
            setPartners(response.data || []);
        } catch (error) {
            console.error("Failed to fetch partners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this partner?")) return;
        try {
            await api.delete(`/partners/${id}`);
            setPartners(partners.map(p => p.id === id ? { ...p, isActive: false } : p));
        } catch (error) {
            console.error("Failed to delete partner:", error);
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
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Partners & Brands</h1>
                <Link
                    href="/partners/create"
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
                    Add Partner
                </Link>
            </div>

            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Partner</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Website</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading partners...</td>
                            </tr>
                        ) : partners.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No partners found</td>
                            </tr>
                        ) : (
                            partners.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '60px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {p.logoUrl ? (
                                                    <img src={p.logoUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                                ) : (
                                                    <Users size={20} color="#9ca3af" />
                                                )}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{p.name}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>
                                        {p.websiteUrl ? (
                                            <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb' }}>
                                                <Globe size={14} />
                                                Visit Link
                                            </a>
                                        ) : "-"}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            backgroundColor: p.isActive ? '#dcfce7' : '#fee2e2',
                                            color: p.isActive ? '#166534' : '#991b1b',
                                        }}>
                                            {p.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <Link href={`/partners/edit/${p.id}`} style={{ padding: '6px', borderRadius: '6px', color: '#4b5563' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id)}
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
