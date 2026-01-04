"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Package, Plus, Search, Filter, Edit, Trash2,
    ChevronDown, MoreHorizontal, CheckCircle2,
    Circle, AlertCircle, Clock, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    sku: string;
    basePrice: number;
    status: string;
    category: { name: string } | null;
    brand: string | null;
    media: { url: string }[];
}

interface Category {
    id: string;
    name: string;
    _count?: { products: number };
}

interface ActivityLog {
    id: string;
    action: string;
    objectType: string;
    objectId: string;
    details: any;
    createdAt: string;
    adminUser: { firstName: string, lastName: string };
}

interface Stats {
    products: number;
    activeProducts: number;
    draftProducts: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats>({ products: 0, activeProducts: 0, draftProducts: 0 });
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes, statsRes, activityRes] = await Promise.all([
                api.get("/products"),
                api.get("/categories"),
                api.get("/admin/stats/overview"),
                api.get("/admin/stats/recent-activity")
            ]);
            setProducts(prodRes.data.items || []);
            setCategories(catRes.data || []);
            setStats({
                products: statsRes.data.products,
                activeProducts: statsRes.data.activeProducts,
                draftProducts: statsRes.data.draftProducts
            });
            setRecentActivity(activityRes.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            // Update stats locally
            setStats(prev => ({ ...prev, products: prev.products - 1 }));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const slug = newCategoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const res = await api.post("/categories", { name: newCategoryName, slug });
            setCategories([...categories, res.data]);
            setNewCategoryName("");
        } catch (error) {
            console.error("Failed to add category:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will deactivate the category.")) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        padding: '20px',
    };

    const statCardStyle: React.CSSProperties = {
        ...cardStyle,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#111827' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Product Management</h1>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Products</span>
                        <Package size={18} />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 600 }}>{stats.products}</span>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Drafts</span>
                        <Circle size={18} />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 600 }}>{stats.draftProducts}</span>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Active</span>
                        <CheckCircle2 size={18} />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 600 }}>{stats.activeProducts}</span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px' }}>

                {/* Product List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Product List</h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                                backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}>
                                <Filter size={16} /> Filter
                            </button>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                                backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}>
                                Bulk Actions <ChevronDown size={14} />
                            </button>
                            <Link href="/products/create" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
                                <Plus size={18} /> Create Product
                            </Link>
                        </div>
                    </div>

                    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f9fafb' }}>
                                    <th style={{ padding: '16px', width: '40px' }}><input type="checkbox" /></th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Product Name</th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Category</th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Price</th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Stock</th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Status</th>
                                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px' }}><input type="checkbox" /></td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                                    {product.media?.[0]?.url ? (
                                                        <img src={product.media[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><Package size={20} /></div>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{product.category?.name || "Uncategorized"}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>₹{product.basePrice.toLocaleString()}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>--</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                                                backgroundColor: product.status === 'published' ? '#dcfce7' : '#f3f4f6',
                                                color: product.status === 'published' ? '#166534' : '#6b7280'
                                            }}>
                                                {product.status === 'published' ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <Link href={`/products/edit/${product.id}`} style={{ color: '#4b5563' }}><Edit size={16} /></Link>
                                                <button onClick={() => handleDelete(product.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Product Card Preview (Simplified for bottom) */}
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Product Card Preview</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-12px', marginBottom: '20px' }}>Visual display of products as they appear on the storefront.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {products.slice(0, 3).map(p => (
                                <div key={p.id} style={{ ...cardStyle, padding: '12px' }}>
                                    <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden' }}>
                                        {p.media?.[0]?.url && <img src={p.media[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0', textAlign: 'center' }}>{p.name}</h4>
                                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0', textAlign: 'center' }}>₹{p.basePrice.toLocaleString()}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: p.status === 'published' ? '#10b981' : '#6b7280' }}>{p.status.toUpperCase()}</span>
                                        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>VIEW</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Category Management */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>Category Management</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 16px 0' }}>Add, edit, or remove product categories.</p>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="New Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Add</button>
                        </form>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {categories.map(cat => (
                                <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>{cat.name}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Changes */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>Recent Changes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {recentActivity.length === 0 ? (
                                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No recent activity.</p>
                            ) : recentActivity.map((log) => (
                                <div key={log.id} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', height: 'max-content' }}>
                                        {log.action === 'CREATE' ? <Plus size={14} /> : log.action === 'UPDATE' ? <Edit size={14} /> : <Trash2 size={14} />}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                                            {log.objectType === 'PRODUCT' ? 'Product' : 'Category'} {log.action.toLowerCase()}: {log.details?.name || 'Item'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                                            {new Date(log.createdAt).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '20px' }}>© 2026 Admin Dashboard. All rights reserved.</p>
        </div>
    );
}
