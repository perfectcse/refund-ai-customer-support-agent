"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import "./home.css";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="home-page">
        <section className="home-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-emoji">🤖</span>
              RefundAI
            </h1>
            <p className="hero-subtitle">
              Smart, policy-driven refund processing agent with admin dashboard
            </p>
            <p className="hero-description">
              Experience AI-powered customer support with real-time refund decisions and transparent policy validation.
            </p>

            <div className="cta-buttons">
              <Link href="/chat" className="cta-primary">
                <span>💬</span>
                Start Chat
              </Link>
              <Link href="/admin" className="cta-secondary">
                <span>📊</span>
                Admin Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Customer Chat</h3>
            <p className="feature-desc">
              Natural conversation-based refund requests. The agent validates orders and applies policy rules in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Admin Dashboard</h3>
            <p className="feature-desc">
              Monitor decisions, inspect tool logs, and test three demo scenarios for success, policy violations, and errors.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Policy Validation</h3>
            <p className="feature-desc">
              Automatic eligibility checks against refund windows, non-refundable categories, and product conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">Local Fallback</h3>
            <p className="feature-desc">
              When OpenAI API quota is exceeded, a reliable local agent ensures uninterrupted refund processing.
            </p>
          </div>
        </section>

        <section className="demo-info">
          <h2>Try It Now</h2>
          <div className="demo-scenarios">
            <div className="scenario">
              <h4>Successful Refund</h4>
              <p>Customer CUS-1001 requesting refund for ORD-2001</p>
              <span className="badge success">APPROVED</span>
            </div>
            <div className="scenario">
              <h4>Policy Violation</h4>
              <p>Customer CUS-1015 requesting refund for ORD-2015 (outside window)</p>
              <span className="badge denied">DENIED</span>
            </div>
            <div className="scenario">
              <h4>Invalid Order</h4>
              <p>Customer CUS-1001 requesting refund for ORD-9999 (not found)</p>
              <span className="badge invalid">INVALID</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

