"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FolderTree, Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count?: {
        products: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This will not delete products in this category.")) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Failed to delete category. Make sure you are logged in.");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Category Management</h1>
                <Link
                    href="/categories/create"
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
                    Add Category
                </Link>
            </div>

            {/* Filters bar */}
            <div style={{ ...cardStyle, padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Category</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Slug</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Description</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Products</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading categories...</td>
                            </tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No categories found</td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FolderTree size={18} color="#9ca3af" />
                                            </div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{category.name}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{category.slug}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                                        {category.description ? (category.description.length > 50 ? category.description.substring(0, 50) + "..." : category.description) : "-"}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{category._count?.products || 0}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <Link href={`/categories/edit/${category.id}`} style={{ padding: '6px', borderRadius: '6px', color: '#4b5563' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
