"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Boxes, Search, Filter, Save,
    AlertTriangle, CheckCircle2, XCircle,
    ArrowUpDown, History, RefreshCcw
} from "lucide-react";
import toast from "react-hot-toast";

interface Variant {
    id: string;
    sku: string;
    title: string;
    product: { name: string; sku: string };
    inventory: {
        quantity: number;
        lowStockThreshold: number;
    } | null;
}

export default function InventoryPage() {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
    const [editedStocks, setEditedStocks] = useState<{ [key: string]: string }>({});
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isBatchUpdating, setIsBatchUpdating] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [historyVariant, setHistoryVariant] = useState<Variant | null>(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/inventory");
            setVariants(res.data);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast.error("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    };

    const handleStockChange = (variantId: string, value: string) => {
        setEditedStocks(prev => ({ ...prev, [variantId]: value }));
    };

    const saveStock = async (variantId: string) => {
        const rawValue = editedStocks[variantId];
        if (rawValue === undefined || rawValue === "") {
            const updatedStocks = { ...editedStocks };
            delete updatedStocks[variantId];
            setEditedStocks(updatedStocks);
            return;
        }

        const newQuantity = parseInt(rawValue);

        try {
            setUpdatingIds(prev => new Set(prev).add(variantId));
            await api.patch(`/admin/inventory/${variantId}`, { quantity: newQuantity });

            setVariants(prev => prev.map(v =>
                v.id === variantId
                    ? { ...v, inventory: v.inventory ? { ...v.inventory, quantity: Number(newQuantity) } : { quantity: Number(newQuantity), lowStockThreshold: 3 } }
                    : v
            ));

            const updatedStocks = { ...editedStocks };
            delete updatedStocks[variantId];
            setEditedStocks(updatedStocks);

            toast.success("Stock updated successfully");
        } catch (error) {
            console.error("Failed to update stock:", error);
            toast.error("Failed to update stock");
        } finally {
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(variantId);
                return next;
            });
        }
    };

    const saveAllStocks = async () => {
        const variantIds = Object.keys(editedStocks).filter(id => editedStocks[id] !== "");
        if (variantIds.length === 0) {
            toast.error("No valid changes to save");
            return;
        }

        try {
            setIsBatchUpdating(true);
            const updatePromises = variantIds.map(id => api.patch(`/admin/inventory/${id}`, { quantity: parseInt(editedStocks[id]) }));
            await Promise.all(updatePromises);

            setVariants(prev => prev.map(v => {
                const newVal = editedStocks[v.id];
                return newVal !== undefined && newVal !== ""
                    ? { ...v, inventory: v.inventory ? { ...v.inventory, quantity: parseInt(newVal) } : { quantity: parseInt(newVal), lowStockThreshold: 3 } }
                    : v;
            }));

            setEditedStocks({});
            toast.success(`Updated ${variantIds.length} items successfully`);
        } catch (error) {
            console.error("Batch update failed:", error);
            toast.error("Some updates failed. Please try again.");
        } finally {
            setIsBatchUpdating(false);
        }
    };

    const getStockStatus = (quantity: number, threshold: number) => {
        if (quantity <= 0) return { id: "out", label: "Out of Stock", color: "#ef4444", bg: "#fee2e2", icon: XCircle };
        if (quantity < threshold) return { id: "low", label: "Low Stock", color: "#f59e0b", bg: "#fef3c7", icon: AlertTriangle };
        return { id: "in", label: "In Stock", color: "#10b981", bg: "#ecfdf5", icon: CheckCircle2 };
    };

    const filteredVariants = variants.filter(v => {
        const matchesSearch = v.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.sku.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === "all") return true;

        const quantity = v.inventory?.quantity ?? 0;
        const threshold = v.inventory?.lowStockThreshold ?? 3;
        const status = getStockStatus(quantity, threshold);

        return status.id === statusFilter;
    });

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #f1f5f9'
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ fontWeight: 500 }}>Loading inventory...</p>
                </div>
                <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', animation: 'fadeIn 0.5s ease-out' }}>
            <style jsx>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Inventory Management</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Monitor and update stock levels for all products.</p>
                        <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#dc2626' }}></div>
                                <span>Save: Update single item</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#dc2626', opacity: 0.7 }}></div>
                                <span>Batch: Update all at once</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search products or variants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '320px', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                    <button
                        onClick={fetchInventory}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                            fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={saveAllStocks}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                borderRadius: '8px', border: 'none',
                                fontSize: '14px', fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
                                transition: 'all 0.2s',
                                opacity: isBatchUpdating ? 0.7 : 1,
                            }}
                        >
                            {isBatchUpdating ? "Saving..." : "Batch Update"} <ArrowUpDown size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {/* Stats cards can be added here if needed, like "Total Items", "Out of Stock", etc. */}
            </div>

            {/* Inventory Table */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Stock Registry</h2>
                    <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                        <button
                            onClick={() => { fetchInventory(); toast.success("Refreshed latest stock updates"); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                                backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px',
                                fontSize: '13px', fontWeight: 500, color: '#64748b', cursor: 'pointer'
                            }}
                        >
                            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                                backgroundColor: statusFilter !== 'all' ? '#fef2f2' : 'white',
                                border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px',
                                fontWeight: 500, color: statusFilter !== 'all' ? '#dc2626' : '#475569',
                                cursor: 'pointer'
                            }}
                        >
                            <Filter size={14} /> {statusFilter === 'all' ? 'Status Filter' : `Status: ${statusFilter}`}
                        </button>
                        {showFilterMenu && (
                            <div style={{
                                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 10, width: '160px',
                                padding: '4px'
                            }}>
                                {['all', 'in', 'low', 'out'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => { setStatusFilter(f); setShowFilterMenu(false); }}
                                        style={{
                                            width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none',
                                            backgroundColor: statusFilter === f ? '#f9fafb' : 'transparent',
                                            borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                                            color: statusFilter === f ? '#dc2626' : '#475569',
                                            fontWeight: statusFilter === f ? 600 : 400
                                        }}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1).replace('all', 'All Status')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Product / Variant</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>SKU</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Current Stock</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVariants.map((v) => {
                            const quantity = v.inventory?.quantity ?? 0;
                            const threshold = v.inventory?.lowStockThreshold ?? 3;
                            const status = getStockStatus(quantity, threshold);
                            const icon = <status.icon size={14} />;
                            const isEditing = editedStocks[v.id] !== undefined;
                            const currentVal = isEditing ? editedStocks[v.id] : quantity;
                            const isUpdating = updatingIds.has(v.id);

                            return (
                                <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{v.product.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{v.title === 'Default' ? 'Base Unit' : v.title}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <code style={{ fontSize: '12px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>{v.sku}</code>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                            fontWeight: 600, backgroundColor: status.bg, color: status.color
                                        }}>
                                            {icon} {status.label}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                                            <input
                                                type="text"
                                                value={currentVal}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === "" || /^[0-9]+$/.test(val)) {
                                                        handleStockChange(v.id, val);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (editedStocks[v.id] === "") {
                                                        const next = { ...editedStocks };
                                                        delete next[v.id];
                                                        setEditedStocks(next);
                                                    }
                                                }}
                                                style={{
                                                    width: '80px', padding: '10px', borderRadius: '8px',
                                                    border: isEditing ? '2px solid #dc2626' : '1px solid #e2e8f0',
                                                    fontSize: '14px', fontWeight: 700, textAlign: 'center',
                                                    outline: 'none', backgroundColor: isEditing ? '#fffafa' : 'white',
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button
                                                onClick={() => saveStock(v.id)}
                                                style={{
                                                    padding: '8px', backgroundColor: '#dc2626', color: 'white',
                                                    borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: (isUpdating || !isEditing) ? 0.5 : 1,
                                                }}
                                                title="Save Changes"
                                            >
                                                <Save size={16} />
                                            </button>
                                            <button
                                                onClick={() => setHistoryVariant(v)}
                                                style={{ padding: '8px', color: '#64748b', border: 'none', background: 'none', cursor: 'pointer' }}
                                                title="Inventory History"
                                            >
                                                <History size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* History Modal */}
            {historyVariant && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Inventory History</h3>
                            <button onClick={() => setHistoryVariant(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: '20px' }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Product</p>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{historyVariant.product.name}</p>
                            <p style={{ fontSize: '13px', color: '#94a3b8' }}>{historyVariant.title === 'Default' ? 'Base Unit' : historyVariant.title} (SKU: {historyVariant.sku})</p>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Current Stock</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{historyVariant.inventory?.quantity || 0} units</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', marginTop: '6px' }}></div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>System Initialized</p>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Initial stock record created</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setHistoryVariant(null)}
                            style={{
                                width: '100%', marginTop: '24px', padding: '12px', backgroundColor: '#dc2626',
                                color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
