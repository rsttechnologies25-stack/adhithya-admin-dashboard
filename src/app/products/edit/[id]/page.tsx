"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        sku: "",
        basePrice: "",
        compareAtPrice: "",
        brand: "",
        categoryId: "",
        shortDescription: "",
        longDescription: "",
        status: "published"
    });

    const [media, setMedia] = useState<{ url: string; mediaType: string }[]>([]);
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetching(true);
                const [productRes, categoriesRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get("/categories")
                ]);

                const data = productRes.data;
                setFormData({
                    name: data.name || "",
                    slug: data.slug || "",
                    sku: data.sku || "",
                    basePrice: data.basePrice?.toString() || "",
                    compareAtPrice: data.compareAtPrice?.toString() || "",
                    brand: data.brand || "",
                    categoryId: data.categoryId || "",
                    shortDescription: data.shortDescription || "",
                    longDescription: data.longDescription || "",
                    status: data.status || "published"
                });
                setMedia(data.media || []);
                setSpecs(data.specs || []);
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error("Failed to fetch product data:", error);
                router.push("/products");
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchData();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMediaChange = (index: number, value: string) => {
        const newMedia = [...media];
        newMedia[index].url = value;
        setMedia(newMedia);
    };

    const addMedia = () => setMedia([...media, { url: "", mediaType: "image" }]);
    const removeMedia = (index: number) => setMedia(media.filter((_, i) => i !== index));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            setLoading(true);
            const response = await api.post('/products/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMedia([...media, { url: response.data.url, mediaType: 'image' }]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
                media: media.filter(m => m.url).map(({ url, mediaType }) => ({ url, mediaType })),
                specs: specs.filter(s => s.key && s.value).map(({ key, value }) => ({ key, value }))
            };
            await api.put(`/products/${id}`, payload);
            router.push("/products");
        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Failed to update product. Make sure you are logged in as admin.");
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/products" style={{ color: '#6b7280', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Basic Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Product Name *</label>
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
                            <label style={labelStyle}>Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                required
                                value={formData.sku}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Pricing</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Base Price (₹) *</label>
                            <input
                                type="number"
                                name="basePrice"
                                required
                                value={formData.basePrice}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Compare at Price (₹)</label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                value={formData.compareAtPrice}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Media (Images)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {media.map((m, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={m.url}
                                    onChange={(e) => handleMediaChange(idx, e.target.value)}
                                    style={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMedia(idx)}
                                    style={{ padding: '8px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                type="button"
                                onClick={addMedia}
                                style={{ fontSize: '14px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                            >
                                + Add Image URL
                            </button>
                            <label style={{ fontSize: '14px', color: '#10b981', cursor: 'pointer', fontWeight: 500 }}>
                                + Upload Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Specifications</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {specs.map((spec, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Label (e.g. Memory)"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. 16GB)"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpec(idx)}
                                    style={{ padding: '8px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpec}
                            style={{ alignSelf: 'flex-start', fontSize: '14px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, marginTop: '8px' }}
                        >
                            + Add Specification
                        </button>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Description</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Short Description</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows={2}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Long Description</label>
                            <textarea
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleChange}
                                rows={5}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>Status</h2>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px' }}>
                    <Link
                        href="/products"
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
                        {loading ? "Saving..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
