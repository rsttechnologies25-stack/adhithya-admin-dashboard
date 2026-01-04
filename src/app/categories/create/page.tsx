"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            slug: name === 'name' && !prev.slug ? value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/categories", formData);
            router.push("/categories");
        } catch (error) {
            console.error("Failed to create category:", error);
            alert("Failed to create category. Make sure you are logged in as admin.");
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
                <Link href="/categories" style={{ color: '#6b7280', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Create New Category</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Category Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Home Appliances"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="home-appliances"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                style={inputStyle}
                                placeholder="Brief description of the category"
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Link
                        href="/categories"
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: 500,
                            textDecoration: 'none',
                        }}
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Category"}
                    </button>
                </div>
            </form>
        </div>
    );
}
