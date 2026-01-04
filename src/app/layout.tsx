"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { token, loading } = useAuth();
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
                <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading...</div>
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!token) {
        return null; // AuthProvider handles redirect
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header />
                <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fafafa', padding: '24px' }}>
                    {children}
                </main>
                <footer style={{ padding: '16px 24px', textAlign: 'center', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                    © {new Date().getFullYear()} Adhithya Electronics. All rights reserved.
                </footer>
            </div>
        </div>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ margin: 0, padding: 0 }}>
                <AuthProvider>
                    <LayoutContent>{children}</LayoutContent>
                </AuthProvider>
            </body>
        </html>
    );
}
