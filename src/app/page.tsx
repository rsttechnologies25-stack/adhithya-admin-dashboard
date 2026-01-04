"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    DollarSign,
    CalendarCheck,
    AlertTriangle,
    Users,
    Package,
    FolderPlus,
    Reply,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    MessageSquare,
    Ticket,
    FolderTree
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [counts, setCounts] = useState({
        products: 0,
        categories: 0,
        users: 0,
        testimonials: 0,
        partners: 0,
        salesToday: 0,
        ordersToday: 0,
        revenueMonth: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/stats/overview");
                setCounts(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: "Total Products", value: counts.products.toString(), change: "Active in catalog", trend: "up", icon: Package, highlight: false },
        { title: "Orders Today", value: counts.ordersToday.toString(), change: "Syncing real-time", trend: "up", icon: CalendarCheck, highlight: false },
        { title: "Active Users", value: counts.users.toString(), change: "Registered customers", trend: "up", icon: Users, highlight: false },
        { title: "Revenue (Month)", value: "₹" + counts.revenueMonth.toLocaleString(), change: "From website sales", trend: "up", icon: DollarSign, highlight: false }
    ];

    const quickActions = [
        { name: "Create Product", icon: Package, href: "/products/create", primary: true },
        { name: "New Category", icon: FolderPlus, href: "/categories/create", primary: false },
        { name: "Add Testimonial", icon: MessageSquare, href: "/testimonials/create", primary: false },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        padding: '20px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        style={{
                            ...cardStyle,
                            backgroundColor: stat.highlight ? '#fef2f2' : 'white',
                            borderColor: stat.highlight ? '#fecaca' : '#f1f5f9',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>{stat.title}</span>
                            <div style={{
                                padding: '8px',
                                backgroundColor: stat.highlight ? '#fee2e2' : '#f3f4f6',
                                borderRadius: '8px'
                            }}>
                                <stat.icon size={18} color={stat.highlight ? '#dc2626' : '#6b7280'} />
                            </div>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: stat.highlight ? '#dc2626' : '#111827', marginBottom: '8px' }}>
                            {loading ? "..." : stat.value}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '24px' }}>Growth Overview</h2>
                    <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#9ca3af', fontSize: '14px' }}>
                        Visual analytics will appear here once order data is available.
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '16px' }}>Content Summary</h2>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ fontSize: '14px', color: '#374151' }}>Categories</span>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{counts.categories}</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ fontSize: '14px', color: '#374151' }}>Testimonials</span>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{counts.testimonials}</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ fontSize: '14px', color: '#374151' }}>Partners & Brands</span>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{counts.partners}</span>
                            </li>
                        </ul>
                    </div>

                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '16px' }}>Quick Actions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {quickActions.map((action) => (
                                <Link
                                    key={action.name}
                                    href={action.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        backgroundColor: action.primary ? '#dc2626' : 'white',
                                        color: action.primary ? 'white' : '#374151',
                                        border: action.primary ? 'none' : '1px solid #e5e7eb',
                                    }}
                                >
                                    <action.icon size={16} />
                                    {action.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
