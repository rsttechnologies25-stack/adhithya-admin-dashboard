"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    MessageSquare,
    PieChart,
    Shield,
    Settings,
    HelpCircle,
    Boxes,
    MapPin
} from "lucide-react";

const navItems = [
    { name: "Overview", icon: LayoutGrid, href: "/" },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Inventory", icon: Boxes, href: "/inventory" },
    { name: "Categories", icon: FolderTree, href: "/categories" },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Branches", icon: MapPin, href: "/branches" },
    { name: "Tickets and Reviews", icon: MessageSquare, href: "/reviews" },
    { name: "Analytics", icon: PieChart, href: "/analytics" },
];

const websiteItems = [
    { name: "Testimonials", icon: MessageSquare, href: "/testimonials" },
    { name: "Partners", icon: Users, href: "/partners" },
];

const adminItems = [
    { name: "Admin Users", icon: Shield, href: "/users" },
];

export default function Sidebar() {
    return (
        <aside style={{
            width: '260px',
            minWidth: '260px',
            backgroundColor: 'white',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Logo */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LayoutGrid color="white" size={18} />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Adhithya Admin</span>
            </div>

            <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
                {/* Management Section */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', paddingLeft: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Management
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map((item) => (
                            <SidebarItem key={item.name} {...item} />
                        ))}
                    </div>
                </div>

                {/* Website Section */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', paddingLeft: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Website
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {websiteItems.map((item) => (
                            <SidebarItem key={item.name} {...item} />
                        ))}
                    </div>
                </div>

                {/* System Section */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', paddingLeft: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        System
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {adminItems.map((item) => (
                            <SidebarItem key={item.name} {...item} />
                        ))}
                    </div>
                </div>
            </nav>


        </aside>
    );
}

function SidebarItem({ name, icon: Icon, href }: { name: string, icon: any, href: string }) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <Link
            href={href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#fef2f2' : 'transparent',
                color: isActive ? '#dc2626' : '#4b5563',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s'
            }}
        >
            <Icon size={18} color={isActive ? '#dc2626' : '#6b7280'} />
            {name}
        </Link>
    );
}
