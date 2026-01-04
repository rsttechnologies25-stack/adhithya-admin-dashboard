"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    MessageSquare,
    Ticket,
    Search,
    Filter,
    MoreVertical,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    ArrowRight,
    Send,
    X,
    Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewsPage() {
    const [activeTab, setActiveTab] = useState("tickets"); // "tickets" or "reviews"
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [replyText, setReplyText] = useState("");

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ openTickets: 0, pendingReviews: 0 });
    const [tickets, setTickets] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, ticketsRes, reviewsRes, activityRes] = await Promise.all([
                api.get("/admin/support/stats"),
                api.get("/admin/support/tickets"),
                api.get("/admin/support/reviews"),
                api.get("/admin/support/activity")
            ]);

            setStats(statsRes.data);
            setTickets(ticketsRes.data);
            setReviews(reviewsRes.data);
            setActivities(activityRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (item: any) => {
        setSelectedItem(item);
        setShowReplyModal(true);
    };

    const sendReply = async () => {
        if (!replyText.trim()) {
            toast.error("Please enter a reply");
            return;
        }

        try {
            if (activeTab === "reviews") {
                await api.post(`/admin/support/reviews/${selectedItem.id}/reply`, { reply: replyText });
                toast.success("Reply sent to review");
            } else {
                // Future: Ticket reply endpoint
                toast.success("Reply sent to ticket");
            }

            setShowReplyModal(false);
            setReplyText("");
            fetchDashboardData();
        } catch (error) {
            toast.error("Failed to send reply");
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '32px', borderRight: '1px solid #e2e8f0' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Support & Reviews</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Manage customer support inquiries and product reviews.</p>
                </header>

                {/* Stats Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    <div style={{
                        backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '12px', color: '#dc2626' }}>
                            <Ticket size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>Open Tickets</p>
                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{stats.openTickets}</p>
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'white', padding: '24px', borderRadius: '16px',
                        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '12px', color: '#f59e0b' }}>
                            <Star size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>Pending Reviews</p>
                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{stats.pendingReviews}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs & Filters */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '0 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <button
                                onClick={() => setActiveTab("tickets")}
                                style={{
                                    padding: '20px 0', fontSize: '14px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                    color: activeTab === "tickets" ? "#dc2626" : "#4b5563",
                                    borderBottom: activeTab === "tickets" ? '2px solid #dc2626' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Ticket Requests
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                style={{
                                    padding: '20px 0', fontSize: '14px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                    color: activeTab === "reviews" ? "#dc2626" : "#4b5563",
                                    borderBottom: activeTab === "reviews" ? '2px solid #dc2626' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Reviews and Ratings
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{ padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#fcfcfc' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ID</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                        {activeTab === "tickets" ? "Subject" : "Context"}
                                    </th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                        {activeTab === "tickets" ? "Customer" : "Rating"}
                                    </th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === "tickets" ? tickets : reviews).map((item: any) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                                            {item.id.slice(0, 8)}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                                                {activeTab === "tickets" ? item.subject : (item.branch?.name || item.product?.name || "Review")}
                                            </span>
                                            {activeTab === "reviews" && item.body && (
                                                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.body}
                                                </p>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {activeTab === "tickets" ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={14} color="#94a3b8" />
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: '#475569' }}>{item.user?.firstName} {item.user?.lastName}</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < item.rating ? "#f59e0b" : "none"}
                                                            color={i < item.rating ? "#f59e0b" : "#e2e8f0"}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                backgroundColor: (item.status === "OPEN" || !item.adminReply) ? "#fff7ed" : "#ecfdf5",
                                                color: (item.status === "OPEN" || !item.adminReply) ? "#f59e0b" : "#10b981"
                                            }}>
                                                {activeTab === "tickets" ? item.status : (item.adminReply ? "Replied" : "Pending")}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleReply(item); }}
                                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', color: '#64748b' }}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Activity Sidebar */}
            <div style={{ width: '320px', padding: '32px', backgroundColor: 'white' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Recent Support Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activities.map((activity, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#94a3b8" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '14px', margin: 0, color: '#475569', lineHeight: '1.5' }}>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{activity.user}</span> {activity.action}
                                    <span style={{ fontWeight: 600, color: activity.type === "ticket" ? "#dc2626" : "#f59e0b", marginLeft: '4px' }}>{activity.target}</span>
                                </p>
                                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                    {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <button style={{
                    width: '100%', marginTop: '40px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600, color: '#4b5563', backgroundColor: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                    View All Activity <ArrowRight size={16} />
                </button>
            </div>

            {/* Reply Modal */}
            {showReplyModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px',
                        padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        <style jsx>{`
                            @keyframes modalSlideUp {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>
                        <button
                            onClick={() => setShowReplyModal(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Reply to {activeTab === "tickets" ? "Ticket" : "Review"}</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Compose a response to the customer's {activeTab === "tickets" ? "inquiry" : "review"}.</p>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Your Reply</label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                style={{
                                    width: '100%', height: '120px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowReplyModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendReply}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626',
                                    color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                Send Reply <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
