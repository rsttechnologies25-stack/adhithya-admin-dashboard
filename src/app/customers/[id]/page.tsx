"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ChevronLeft, Mail, Phone, Calendar,
    ShoppingBag, MapPin, Trash2, Edit
} from "lucide-react";
import Link from "next/link";

interface CustomerDetail {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    createdAt: string;
    addresses: any[];
    orders: any[];
}

export default function CustomerDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/customers/${id}`);
            setCustomer(res.data);
        } catch (error) {
            console.error("Failed to fetch customer:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            await api.delete(`/admin/customers/${id}`);
            router.push("/customers");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to delete customer.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading details...</div>;
    if (!customer) return <div style={{ padding: '40px', textAlign: 'center' }}>Customer not found.</div>;

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f1f5f9',
        marginBottom: '24px'
    };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Link href="/customers" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>
                <ChevronLeft size={18} /> Back to Customers
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 700, color: '#475569' }}>
                        {customer.firstName[0]}{customer.lastName[0]}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>{customer.firstName} {customer.lastName}</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Customer ID: {customer.id}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Edit size={18} /> Edit Profile
                    </button>
                    <button onClick={handleDelete} style={{ padding: '10px 20px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Trash2 size={18} /> Delete Customer
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                <div>
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div>
                                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>Email Address</p>
                                <p style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> {customer.email}</p>
                            </div>
                            <div>
                                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>Phone Number</p>
                                <p style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> {customer.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>Joined Date</p>
                                <p style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {new Date(customer.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Recent Orders</h3>
                        {customer.orders.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No orders placed yet.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Order ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Date</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Amount</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customer.orders.map((order: any) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>#{order.orderNumber}</td>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600 }}>₹{order.total.toLocaleString()}</td>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: 600 }}>{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div>
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Saved Addresses</h3>
                        {customer.addresses.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center' }}>No addresses saved.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {customer.addresses.map((addr: any) => (
                                    <div key={addr.id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#dc2626" /> {addr.type || 'Address'}</p>
                                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{addr.street}, {addr.city}</p>
                                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{addr.state} {addr.zipCode}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ ...cardStyle, backgroundColor: '#dc2626', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <ShoppingBag size={24} />
                            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Account Status</h3>
                        </div>
                        <p style={{ fontSize: '14px', margin: '0 0 20px 0', opacity: 0.9 }}>This customer has completed {customer.orders.length} orders to date.</p>
                        <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '12px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Wallet Balance</p>
                            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>₹0.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
