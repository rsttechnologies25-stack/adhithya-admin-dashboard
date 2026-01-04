"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Users, Search, Filter, Trash2,
    ChevronDown, Mail, Phone, Calendar,
    ShoppingBag, CheckCircle2, UserCheck,
    ArrowUpRight, MoreHorizontal
} from "lucide-react";
import Link from "next/link";

interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    createdAt: string;
    _count: { orders: number };
}

interface Stats {
    totalCustomers: number;
    newCustomersMonth: number;
    activeCustomers: number;
    avgOrderValue: number;
    retentionRate: number;
    segmentation: {
        vip: number;
        returning: number;
        newSignups: number;
    };
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalCustomers: 0,
        newCustomersMonth: 0,
        activeCustomers: 0,
        avgOrderValue: 0,
        retentionRate: 0,
        segmentation: { vip: 0, returning: 0, newSignups: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [custRes, statsRes] = await Promise.all([
                api.get("/admin/customers"),
                api.get("/admin/stats/overview")
            ]);
            setCustomers(custRes.data || []);
            setStats({
                totalCustomers: statsRes.data.users,
                newCustomersMonth: statsRes.data.newCustomersMonth,
                activeCustomers: statsRes.data.activeCustomers,
                avgOrderValue: statsRes.data.avgOrderValue,
                retentionRate: statsRes.data.retentionRate,
                segmentation: statsRes.data.segmentation
            });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/customers/${id}`);
            setCustomers(customers.filter(c => c.id !== id));
            setStats(prev => ({ ...prev, totalCustomers: prev.totalCustomers - 1 }));
        } catch (error: any) {
            console.error("Failed to delete customer:", error);
            alert(error.response?.data?.message || "Failed to delete customer. They might have existing orders.");
        }
    };

    const filteredCustomers = customers.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #f1f5f9'
    };

    const statCardStyle = {
        ...cardStyle,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ fontWeight: 500 }}>Loading customers...</p>
                </div>
                <style jsx>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', animation: 'fadeIn 0.5s ease-out' }}>
            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Customers</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Manage your customer relationships and view order history.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '300px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                        />
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}>
                        Export List <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Total Customers</span>
                        <div style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}><Users size={20} /></div>
                    </div>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{stats.totalCustomers}</span>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>Overall registered users</span>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>New this Month</span>
                        <div style={{ padding: '8px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '8px' }}><UserCheck size={20} /></div>
                    </div>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{stats.newCustomersMonth}</span>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>Signups this billing cycle</span>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Active Customers</span>
                        <div style={{ padding: '8px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '8px' }}><ShoppingBag size={20} /></div>
                    </div>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{stats.activeCustomers}</span>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Customers with orders</span>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>

                {/* Table Section */}
                <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Customer Registry</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                                <Filter size={14} /> Filter
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                                Bulk Actions <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Contact</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Joined</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Orders</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            ) : filteredCustomers.map((cust) => (
                                <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, color: '#475569' }}>
                                                {cust.firstName[0]}{cust.lastName[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{cust.firstName} {cust.lastName}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {cust.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                                <Mail size={14} /> {cust.email}
                                            </div>
                                            {cust.phone && (
                                                <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                                                    <Phone size={14} /> {cust.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                            <Calendar size={14} /> {new Date(cust.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'inline-flex', padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                                            {cust._count.orders} Orders
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                            <Link
                                                href={`/customers/${cust.id}`}
                                                title="View Details"
                                                style={{ color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                            >
                                                <MoreHorizontal size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cust.id)}
                                                title="Delete Customer"
                                                style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Quick Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Retention Rate</span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{stats.retentionRate.toFixed(1)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Avg. Order Value</span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>₹{stats.avgOrderValue.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Customer Lifetime</span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Stable</span>
                            </div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Segmentation</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>VIP Customers</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>{stats.segmentation.vip}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Spent {">"} ₹50,000</div>
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Returning</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>{stats.segmentation.returning}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Multiple orders</div>
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>New Signups</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>{stats.segmentation.newSignups}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Joined last 7 days</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '40px' }}>
                © 2026 Adhithya Electronics Admin Panel. All data is real-time.
            </p>
        </div>
    );
}
