"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./navigation.css";

export default function Navigation() {
  const pathname = usePathname();

  const isChat = pathname === "/chat";
  const isAdmin = pathname === "/admin";

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-icon">🤖</span>
          <span className="nav-logo-text">RefundAI</span>
        </Link>

        <div className="nav-links">
          <Link
            href="/chat"
            className={`nav-link ${isChat ? "active" : ""}`}
          >
            <span className="nav-link-icon">💬</span>
            <span className="nav-link-text">Customer Chat</span>
          </Link>

          <Link
            href="/admin"
            className={`nav-link ${isAdmin ? "active" : ""}`}
          >
            <span className="nav-link-icon">📊</span>
            <span className="nav-link-text">Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
