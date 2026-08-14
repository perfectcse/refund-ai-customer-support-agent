"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import "./admin.css";

const DEMO_SCENARIOS = [
  {
    id: "success",
    label: "Successful refund",
    detail: "Customer CUS-1001 requests a valid refund for ORD-2001.",
    prompt: "I want a refund for ORD-2001. My customer ID is CUS-1001.",
    expectedDecision: "APPROVED"
  },
  {
    id: "policy",
    label: "Policy violation",
    detail: "Customer CUS-1015 asks for a refund on an order that exceeds the policy window.",
    prompt: "I want a refund for ORD-2015. My customer ID is CUS-1015.",
    expectedDecision: "DENIED"
  },
  {
    id: "invalid",
    label: "Invalid order",
    detail: "Customer CUS-1001 tries to refund a nonexistent order.",
    prompt: "I want a refund for ORD-9999. My customer ID is CUS-1001.",
    expectedDecision: "INVALID"
  }
];

export default function AdminPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const [logs, setLogs] = useState([]);
  const [decision, setDecision] = useState(null);
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedScenario = useMemo(
    () => DEMO_SCENARIOS.find((scenario) => scenario.id === selectedScenarioId) || DEMO_SCENARIOS[0],
    [selectedScenarioId]
  );

  async function runDemo(scenarioId = selectedScenarioId) {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === scenarioId) || DEMO_SCENARIOS[0];

    setLoading(true);
    setLogs([]);
    setDecision(null);
    setRefund(null);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: scenario.prompt
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run agent.");
      }

      const normalizedDecision = String(data.decision || scenario.expectedDecision || "PENDING").toUpperCase();

      setLogs(data.events || []);
      setDecision(normalizedDecision);
      setRefund(data.refund || null);
    } catch (error) {
      console.error(error);
      setLogs([]);
      setDecision(scenario.expectedDecision || "PENDING");
      setRefund(null);
    } finally {
      setLoading(false);
    }
  }

  const finalDecision = decision ? decision.toUpperCase() : "PENDING";

  const statusClass =
    finalDecision === "APPROVED"
      ? "approved"
      : finalDecision === "DENIED"
        ? "denied"
        : finalDecision === "INVALID" || finalDecision === "FAILED"
          ? "invalid"
          : "pending";

  return (
    <>
      <Navigation />
      <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Operations console</p>
            <h1 className="admin-title">RefundAI Admin</h1>
          </div>

          <div className="admin-actions">
            <span className="admin-badge">System online</span>
            <button
              className="admin-button"
              onClick={() => runDemo(selectedScenarioId)}
              disabled={loading}
            >
              {loading ? "Running demo..." : "Run selected scenario"}
            </button>
          </div>
        </header>

        <section className="scenario-panel">
          <div className="scenario-header">
            <h2 className="section-title">Demo scenarios</h2>
            <p className="scenario-subtitle">Trigger a realistic refund workflow and inspect the failure handling path.</p>
          </div>

          <div className="scenario-selector">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`scenario-button ${selectedScenarioId === scenario.id ? "active" : ""}`}
                onClick={() => setSelectedScenarioId(scenario.id)}
              >
                <span className="scenario-name">{scenario.label}</span>
                <span className="scenario-meta">{scenario.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="admin-grid">
          <div className="admin-card">
            <span className="card-label">Agent status</span>
            <div className="card-value muted">
              {loading ? "Processing" : "Ready"}
            </div>
          </div>

          <div className="admin-card">
            <span className="card-label">Decision</span>
            <div className={`status-pill ${statusClass}`}>
              {finalDecision}
            </div>
          </div>

          <div className="admin-card">
            <span className="card-label">Refund amount</span>
            <div className={`card-value ${refund ? "success" : "muted"}`}>
              {refund ? `₹${refund.amount}` : "—"}
            </div>
          </div>
        </section>

        <section className="admin-main">
          <div className="timeline-card">
            <div className="card-header-row">
              <h2 className="section-title">Activity timeline</h2>
              <span className="scenario-chip">{selectedScenario.label}</span>
            </div>

            {logs.length === 0 ? (
              <p className="empty-state">No agent activity yet. Select a scenario and run the demo to inspect the pipeline.</p>
            ) : (
              <div className="timeline">
                {logs.map((log, index) => {
                  const logStatus = String(log.status || "INFO").toLowerCase();

                  return (
                    <div
                      key={`${log.tool || log.type}-${index}`}
                      className={`timeline-item ${logStatus}`}
                    >
                      <div className="timeline-body">
                        <div className="timeline-top">
                          <span className="timeline-tool">
                            {log.tool || log.type || "Agent"}
                          </span>

                          <span className={`timeline-status ${logStatus}`}>
                            {log.status || "INFO"}
                          </span>
                        </div>

                        <p className="timeline-message">{log.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="refund-card">
            <h2 className="section-title">Scenario summary</h2>

            <div className="scenario-summary">
              <div className="summary-row">
                <span className="refund-label">Scenario</span>
                <span className="refund-value">{selectedScenario.label}</span>
              </div>

              <div className="summary-row">
                <span className="refund-label">Input</span>
                <span className="refund-value quote">{selectedScenario.prompt}</span>
              </div>

              <div className="summary-row">
                <span className="refund-label">Expected result</span>
                <span className="refund-value">{selectedScenario.expectedDecision}</span>
              </div>
            </div>

            <h3 className="mini-title">Refund summary</h3>

            {refund ? (
              <div className="refund-details">
                <div className="refund-row">
                  <span className="refund-label">Refund ID</span>
                  <span className="refund-value">{refund.refundId}</span>
                </div>

                <div className="refund-row">
                  <span className="refund-label">Amount</span>
                  <span className="refund-value">₹{refund.amount}</span>
                </div>

                <div className="refund-row">
                  <span className="refund-label">Status</span>
                  <span className="refund-value">{refund.status}</span>
                </div>

                <div className="refund-row">
                  <span className="refund-label">Mode</span>
                  <span className="refund-value">{refund.mode || "Live"}</span>
                </div>
              </div>
            ) : (
              <p className="empty-state">No refund has been processed yet for this scenario.</p>
            )}
          </aside>
        </section>
      </div>
    </main>
    </>
  );
}