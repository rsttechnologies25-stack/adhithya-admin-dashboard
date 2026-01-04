"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    Search,
    Loader2,
    Package,
    Tag,
    X,
    Filter
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [trends, setTrends] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [topCategories, setTopCategories] = useState<any[]>([]);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [segments, setSegments] = useState<any[]>([]);

    const [trendsPeriod, setTrendsPeriod] = useState("Daily");
    const [eventFilter, setEventFilter] = useState("All");

    // Default Date Range: Last 7 days
    const defaultEnd = new Date().toISOString().split('T')[0];
    const defaultStart = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, [trendsPeriod, startDate, endDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const params = {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                period: trendsPeriod.toLowerCase()
            };

            const [summaryRes, trendsRes, topSellingRes, topCategoriesRes, recentEventsRes, segmentsRes] = await Promise.all([
                api.get("/admin/analytics/summary", { params }),
                api.get("/admin/analytics/trends", { params }),
                api.get("/admin/analytics/top-selling", { params }),
                api.get("/admin/analytics/top-categories", { params }),
                api.get("/admin/analytics/recent-events", { params }),
                api.get("/admin/analytics/customer-segments")
            ]);

            setSummary(summaryRes.data);
            setTrends(trendsRes.data);
            setTopProducts(topSellingRes.data);
            setTopCategories(topCategoriesRes.data);
            setRecentEvents(recentEventsRes.data);
            setSegments(segmentsRes.data);
        } catch (error) {
            console.error("Failed to fetch analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select a date range first");
            return;
        }

        try {
            toast.loading("Preparing Excel sheet...", { id: "export" });
            const response = await api.get("/admin/analytics/export", {
                params: { startDate, endDate },
                responseType: 'arraybuffer' // Using arraybuffer for more reliable blob conversion
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_report_${startDate}_to_${endDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Excel sheet downloaded!", { id: "export" });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Export failed. Please try again.", { id: "export" });
        }
    };

    const filteredEvents = recentEvents.filter(event => {
        if (eventFilter === "All") return true;
        if (eventFilter === "Completed") return event.status === "DELIVERED";
        if (eventFilter === "Pending") return event.status !== "DELIVERED";
        return true;
    });

    if (loading && !summary) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Analytics Dashboard</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Showing data for {startDate} - {endDate}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                    <div
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0',
                            fontSize: '13px', color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontWeight: 500
                        }}
                    >
                        <Calendar size={16} color="#64748b" />
                        {startDate} - {endDate}
                    </div>

                    {showDatePicker && (
                        <div ref={datePickerRef} style={{
                            position: 'absolute', top: '50px', right: '130px', zIndex: 100,
                            backgroundColor: 'white', padding: '20px', borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                            border: '1px solid #f1f5f9', width: '280px'
                        }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => { setStartDate(defaultStart); setEndDate(defaultEnd); setShowDatePicker(false); }}
                                    style={{ flex: 1, padding: '8px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowDatePicker(false)}
                                    style={{ flex: 1, padding: '8px', fontSize: '13px', border: 'none', borderRadius: '6px', backgroundColor: '#dc2626', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleExport}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            backgroundColor: '#dc2626', color: 'white', fontWeight: 600, border: 'none',
                            borderRadius: '10px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)'
                        }}
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <KPICard
                    label="Revenue (Period)"
                    value={`₹${summary?.totalRevenue?.toLocaleString() || 0}`}
                    change={summary?.revenueChange || 0}
                    isPositive={(summary?.revenueChange || 0) >= 0}
                />
                <KPICard
                    label="Period Growth"
                    value={`${(summary?.revenueChange || 0)}%`}
                    change={summary?.revenueChange || 0}
                    isPositive={(summary?.revenueChange || 0) >= 0}
                />
                <KPICard
                    label="Orders (Period)"
                    value={summary?.totalOrders?.toLocaleString() || 0}
                    change={summary?.ordersChange || 0}
                    isPositive={(summary?.ordersChange || 0) >= 0}
                />
                <KPICard
                    label="Avg. Order Value"
                    value={`₹${Math.round(summary?.avgOrderValue || 0).toLocaleString()}`}
                    change={summary?.aovChange || 0}
                    isPositive={(summary?.aovChange || 0) >= 0}
                />
                <KPICard
                    label="Conversion Rate"
                    value={`${(summary?.conversionRate || 0).toFixed(1)}%`}
                    change={summary?.conversionChange || 0}
                    isPositive={(summary?.conversionChange || 0) >= 0}
                />
            </div>

            {/* Main Charts area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div style={{
                    backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Revenue Trends</h3>
                        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                            <TabButton active={trendsPeriod === "Daily"} label="Daily" onClick={() => setTrendsPeriod("Daily")} />
                            <TabButton active={trendsPeriod === "Weekly"} label="Weekly" onClick={() => setTrendsPeriod("Weekly")} />
                            <TabButton active={trendsPeriod === "Monthly"} label="Monthly" onClick={() => setTrendsPeriod("Monthly")} />
                        </div>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Loader2 size={24} className="animate-spin" color="#dc2626" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#dc2626"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{
                        backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Top Selling Products</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {topProducts.length === 0 ? <p style={{ fontSize: '13px', color: '#94a3b8' }}>No data available</p> : topProducts.map((p, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>{p.name}</span>
                                        <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{p.value.toLocaleString()}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(p.value / (topProducts[0]?.value || 1)) * 100}%`,
                                            height: '100%',
                                            backgroundColor: '#dc2626',
                                            borderRadius: '4px'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Top Categories</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {topCategories.length === 0 ? <p style={{ fontSize: '13px', color: '#94a3b8' }}>No data available</p> : topCategories.map((c, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        backgroundColor: i === 0 ? '#dc2626' : (i === 1 ? '#334155' : '#94a3b8')
                                    }} />
                                    <span style={{ flex: 1, fontSize: '14px', color: '#475569' }}>{c.name}</span>
                                    <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>₹{(c.value / 100000).toFixed(1)}L</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Customer Segments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {segments.map((seg, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '14px', color: '#475569' }}>{seg.label}</span>
                                        <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                                            {summary?.totalUsers > 0 ? Math.round((seg.value / summary.totalUsers) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                                        <div style={{
                                            width: `${summary?.totalUsers > 0 ? (seg.value / summary.totalUsers) * 100 : 0}%`,
                                            height: '100%',
                                            backgroundColor: seg.color,
                                            borderRadius: '3px'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Recent Events & Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
                <div style={{
                    backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Recent Revenue Events</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setEventFilter("All")}
                                style={{
                                    padding: '6px 16px', borderRadius: '8px', border: eventFilter === "All" ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: eventFilter === "All" ? '#dc2626' : 'transparent',
                                    color: eventFilter === "All" ? 'white' : '#64748b', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setEventFilter("Completed")}
                                style={{
                                    padding: '6px 16px', borderRadius: '8px', border: eventFilter === "Completed" ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: eventFilter === "Completed" ? '#dc2626' : 'transparent',
                                    color: eventFilter === "Completed" ? 'white' : '#64748b', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => setEventFilter("Pending")}
                                style={{
                                    padding: '6px 16px', borderRadius: '8px', border: eventFilter === "Pending" ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: eventFilter === "Pending" ? '#dc2626' : 'transparent',
                                    color: eventFilter === "Pending" ? 'white' : '#64748b', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No events found for this period</td></tr> : filteredEvents.map((event, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{event.orderNumber}</td>
                                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#475569' }}>{event.user?.firstName} {event.user?.lastName}</td>
                                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>₹{event.total.toLocaleString()}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                            backgroundColor: event.status === 'DELIVERED' ? '#ecfdf5' : '#fef2f2',
                                            color: event.status === 'DELIVERED' ? '#10b981' : '#dc2626'
                                        }}>
                                            {event.status.toLowerCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#64748b' }}>
                                        {new Date(event.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Metrics Comparison</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <ComparisonRow label="Revenue" current={`₹${(summary?.totalRevenue || 0).toLocaleString()}`} change={summary?.revenueChange || 0} />
                        <ComparisonRow label="Orders" current={(summary?.totalOrders || 0).toLocaleString()} change={summary?.ordersChange || 0} />
                        <ComparisonRow label="Avg. Value" current={`₹${Math.round(summary?.avgOrderValue || 0).toLocaleString()}`} change={summary?.aovChange || 0} />
                        <ComparisonRow label="Conversion" current={`${(summary?.conversionRate || 0).toFixed(1)}%`} change={summary?.conversionChange || 0} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ label, value, change, isPositive }: any) {
    return (
        <div style={{
            backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{value}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: isPositive ? '#10b981' : '#dc2626', fontWeight: 600 }}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {change}%
            </div>
        </div>
    );
}

function TabButton({ label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none',
                backgroundColor: active ? 'white' : 'transparent', color: active ? '#0f172a' : '#64748b',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
            }}
        >
            {label}
        </button>
    );
}

function ComparisonRow({ label, current, change }: any) {
    const isPositive = change >= 0;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px 0' }}>{label}</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{current}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: isPositive ? '#10b981' : '#dc2626', fontWeight: 600 }}>
                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {Math.abs(change)}%
            </div>
        </div>
    );
}
