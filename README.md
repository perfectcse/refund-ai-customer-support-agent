# RefundAI — AI Customer Support Agent

<div align="center">

![RefundAI](https://img.shields.io/badge/RefundAI-Customer%20Support%20Agent-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square)

**A policy-driven AI customer support agent for handling e-commerce refund requests.**

[Live Demo](#live-demo) • [Architecture](#architecture) • [API Documentation](#api-documentation)

</div>

---

## 🎯 Overview

**RefundAI** is an AI customer support agent prototype designed to handle e-commerce refund requests while strictly following a predefined refund policy.

The application combines a customer-facing chat interface, an OpenAI-powered function-calling agent, mock CRM data, deterministic refund-policy validation, mock refund processing, and an admin dashboard for viewing agent activity.

The project was built as a hands-on product vertical slice for an AI Customer Support Agent assignment.

### What RefundAI demonstrates

- 🤖 OpenAI-powered agent with function calling
- 🔧 Dynamic tool execution for CRM and refund operations
- 📋 Strict refund-policy validation
- 💬 Customer-facing refund chat
- 📊 Admin dashboard with agent activity logs
- ✅ Approved and denied refund flows
- ⚠️ Invalid-data/failure handling
- 🔄 Local deterministic fallback when OpenAI is unavailable
- 📱 Responsive customer and admin interfaces

---

## ✨ Key Features

### Customer Chat

- Natural-language refund requests
- Customer and order validation through tools
- Refund eligibility checking
- Clear APPROVED / DENIED responses
- Refund details displayed after successful processing
- Typing/loading indicator
- Agent activity summary
- Responsive design

### Admin Dashboard

The admin dashboard provides a controlled environment for demonstrating the agent workflow.

#### Demo scenarios

1. **Standard Refund**
   - Customer: `CUS-1001`
   - Order: `ORD-2001`
   - Expected: `APPROVED`

2. **Policy Violation**
   - Customer: `CUS-1002`
   - Order: `ORD-2002`
   - Expected: `DENIED`
   - Refund calculation and processing are not executed.

3. **Invalid Order**
   - Customer: `CUS-1001`
   - Order: `ORD-9999`
   - Expected: `FAILED`
   - The agent stops safely when the order cannot be found.

### Refund Policy Engine

The mock refund policy currently includes:

- **Refund window:** 7 days from delivery
- **Non-refundable categories:** Digital and Personalized products
- **Order/customer ownership validation**
- **Duplicate refund prevention**
- **Product/order condition checks**
- **Refund amount validation**

The policy is enforced by the application tools and is not intended to be overridden by the AI agent.

### Resilience

The application uses OpenAI as the primary LLM provider.

If the OpenAI API is unavailable or the account has insufficient quota, the application can switch to a deterministic local demo agent so the core assignment flows remain testable.

This fallback is intended for demonstration and development; it does not replace the LLM-powered agent.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│                                                             │
│   ┌──────────────────┐       ┌──────────────────────────┐   │
│   │ Customer Chat    │       │ Admin Dashboard          │   │
│   │ /chat            │       │ /admin                   │   │
│   └────────┬─────────┘       └────────────┬─────────────┘   │
└────────────┼──────────────────────────────┼─────────────────┘
             │                              │
             └──────────── HTTP/JSON ───────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │     Next.js API Route    │
              │       /api/agent         │
              └────────────┬─────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ OpenAI Agent    │  │ Local Demo      │
        │ GPT-4o-mini     │  │ Agent Fallback  │
        │ Function Calls  │  │ Deterministic   │
        └────────┬────────┘  └────────┬────────┘
                 │                    │
                 └─────────┬──────────┘
                           ▼
                 ┌──────────────────────┐
                 │    Tool Executor    │
                 └──────────┬───────────┘
                            │
          ┌─────────────────┼──────────────────┐
          ▼                 ▼                  ▼
     ┌─────────┐     ┌─────────────┐    ┌─────────────┐
     │   CRM   │     │   Policy    │    │   Refund    │
     │  Data   │     │  Validator  │    │ Operations  │
     └─────────┘     └─────────────┘    └─────────────┘
```

### Agent Workflow

```text
Customer Request
       │
       ▼
Identify Customer + Order
       │
       ▼
getCustomer
       │
       ▼
getOrder
       │
       ▼
checkRefundEligibility
       │
       ├─────────────── Policy Failed ──────────────► DENIED
       │
       ▼
calculateRefund
       │
       ▼
processRefund
       │
       ▼
APPROVED + Refund Details
```

The agent is instructed to use CRM information and the policy-validation tool before making a refund decision. It must not claim that a refund was processed unless the refund-processing tool confirms it.

---

## 🔧 Agent Tools

The agent can dynamically call the following tools:

| Tool | Purpose |
|---|---|
| `getCustomer` | Retrieves and validates customer information |
| `getCustomerOrders` | Retrieves orders belonging to a customer |
| `getOrder` | Retrieves a specific order |
| `checkRefundEligibility` | Applies the refund policy |
| `calculateRefund` | Calculates the refundable amount |
| `processRefund` | Performs mock refund processing |

### Tool execution rule

The important safety flow is:

```text
getCustomer
     ↓
getOrder
     ↓
checkRefundEligibility
     ↓
Only if eligible
     ↓
calculateRefund
     ↓
processRefund
```

For a denied request, `calculateRefund` and `processRefund` should not execute.

---

## 📋 Refund Policy

The current mock policy is intentionally strict.

### Eligibility checks

A refund can only proceed when:

1. The customer exists.
2. The order exists.
3. The customer owns the order.
4. The order has not already been refunded.
5. The product category is refundable.
6. The request is within the 7-day refund window.
7. The order satisfies the required product/order conditions.
8. The refund amount is valid.

### Example

```text
Customer: CUS-1002
Order:    ORD-2002

Customer exists       ✓
Order exists          ✓
Policy eligibility    ✕

Result:
Refund DENIED
```

The policy engine is deterministic and is the final authority for refund eligibility.

---

## 🗄️ Mock CRM Data

The application uses in-memory mock data for the assignment.

- **15 customer profiles**
- Mock customer/order relationships
- Mock order statuses
- Mock delivery dates
- Mock product categories
- Mock refund states

The data is intended for demonstration only and is not connected to a production CRM or payment provider.

---

## 📁 Project Structure

The project is organized around the Next.js application, agent orchestration, mock CRM, and policy layers.

```text
src/
├── app/
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
│   │
│   ├── chat/
│   │   ├── page.js
│   │   └── chat.css
│   │
│   ├── admin/
│   │   ├── page.js
│   │   └── admin.css
│   │
│   └── api/
│       └── agent/
│           └── route.js
│
├── components/
│   ├── ChatWindow.jsx
│   ├── ChatInput.jsx
│   ├── MessageBubble.jsx
│   └── Navigation.jsx
│
├── lib/
│   ├── agent/
│   │   ├── agent.js
│   │   ├── local-agent.js
│   │   └── tools.js
│   │
│   ├── crm/
│   │   └── crm.js
│   │
│   └── policy/
│       ├── policy-validator.js
│       └── refund-policy.js
│
├── data/
│   ├── customers.js
│   └── orders.js
│
└── public/
    └── static assets
```

> Keep this structure synchronized with the actual repository before submission.

---

## 🔌 API Documentation

### `POST /api/agent`

Sends a customer message to the refund agent.

### Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I want a refund for ORD-2001. My customer ID is CUS-1001."
    }
  ]
}
```

### Successful response

```json
{
  "response": "Your refund has been approved and processed successfully.",
  "decision": "APPROVED",
  "refund": {
    "refundId": "REF-1723683842000",
    "amount": 2499,
    "currency": "INR",
    "status": "REFUNDED"
  },
  "events": [
    {
      "tool": "getCustomer",
      "status": "SUCCESS",
      "message": "Customer verified."
    },
    {
      "tool": "getOrder",
      "status": "SUCCESS",
      "message": "Order ORD-2001 retrieved."
    },
    {
      "tool": "checkRefundEligibility",
      "status": "PASSED",
      "message": "Order satisfies all refund policy requirements."
    },
    {
      "tool": "calculateRefund",
      "status": "SUCCESS",
      "message": "Refund amount calculated: ₹2499"
    },
    {
      "tool": "processRefund",
      "status": "SUCCESS",
      "message": "Refund processed successfully."
    }
  ],
  "mode": "local"
}
```

### Policy violation response

```json
{
  "response": "I'm sorry, but I can't approve the refund because the order does not satisfy the refund policy.",
  "decision": "DENIED",
  "refund": null,
  "events": [
    {
      "tool": "getCustomer",
      "status": "SUCCESS",
      "message": "Customer verified."
    },
    {
      "tool": "getOrder",
      "status": "SUCCESS",
      "message": "Order retrieved."
    },
    {
      "tool": "checkRefundEligibility",
      "status": "FAILED",
      "message": "The refund policy requirements were not satisfied."
    }
  ],
  "mode": "local"
}
```

### Common status codes

| Code | Meaning |
|---|---|
| `200` | Request processed |
| `400` | Invalid/missing request data |
| `401` | Missing or invalid OpenAI credentials |
| `429` | OpenAI quota unavailable; local fallback can be used |
| `500` | Unexpected server error |

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

The OpenAI key is optional for the local deterministic fallback, but it is required to run the OpenAI-powered agent.

**Never commit `.env.local` or an actual API key to GitHub.**

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
.env.*.local
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Optional: OpenAI API key with available quota

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/refund-ai-customer-support-agent.git
cd refund-ai-customer-support-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

```text
http://localhost:3000
```

Customer chat:

```text
http://localhost:3000/chat
```

Admin dashboard:

```text
http://localhost:3000/admin
```

---

## 🧪 Testing

### Scenario 1 — Standard Refund

```text
Customer: CUS-1001
Order:    ORD-2001
```

Expected:

```text
getCustomer              SUCCESS
getOrder                 SUCCESS
checkRefundEligibility   PASSED
calculateRefund          SUCCESS
processRefund            SUCCESS

Decision: APPROVED
```

### Scenario 2 — Policy Violation

```text
Customer: CUS-1002
Order:    ORD-2002
```

Expected:

```text
getCustomer              SUCCESS
getOrder                 SUCCESS
checkRefundEligibility   FAILED

Decision: DENIED
```

The following tools should not execute:

```text
calculateRefund
processRefund
```

### Scenario 3 — Invalid Order

```text
Customer: CUS-1001
Order:    ORD-9999
```

Expected:

```text
getCustomer    SUCCESS
getOrder       FAILED
```

The agent should stop safely without processing a refund.

---

## 🔄 OpenAI Fallback Behavior

The project includes explicit error normalization for OpenAI authentication and quota failures.

When the OpenAI API returns an insufficient-quota response, the application can switch to the local deterministic demo agent.

Example server log:

```text
OpenAI quota unavailable. Switching to local demo agent.
POST /api/agent 200
```

This allows the assignment demo to remain functional even when the external LLM provider is unavailable.

The fallback does not claim to provide the same natural-language reasoning capability as the LLM. It is a deterministic development/demo path.

---

## 🛡️ Safety & Business Rules

RefundAI follows several important rules:

- Never invent customer or order information.
- Retrieve customer/order information through CRM tools.
- Always check refund eligibility before approving a refund.
- Never override the refund policy.
- Do not claim a refund was processed unless the processing tool confirms it.
- Stop the workflow when required information or order data is unavailable.
- Do not calculate or process a refund after policy denial.

These rules are enforced through the agent instructions and application tools.

---

## 📊 Admin Dashboard

The admin dashboard is designed to make the agent workflow easy to inspect during development and demonstration.

It displays:

- Selected demo scenario
- Number of agent events
- Refund decision
- Refund amount
- Customer/order information
- Tool execution timeline
- Success/failure status
- Refund transaction details

The dashboard exposes **tool execution and decision events**, not hidden model chain-of-thought.

---

## 🎥 Demo

### Required demo scenarios

The video walkthrough should demonstrate:

1. **Standard refund**
   - `CUS-1001`
   - `ORD-2001`
   - Successful policy validation and refund processing

2. **Policy violation**
   - `CUS-1002`
   - `ORD-2002`
   - Policy check fails
   - Refund is denied
   - Refund processing tools are not executed

3. **Failure handling**
   - `CUS-1001`
   - `ORD-9999`
   - Order lookup fails
   - Agent stops safely

### Video walkthrough should cover

- Live customer chat demo
- Admin dashboard
- Agent activity logs
- Agent/tool architecture
- CRM and refund-policy structure
- OpenAI integration
- Local fallback behavior
- Failure handling



---

## 🌐 Live Demo

**Deployed application:** `ADD_DEPLOYED_URL_HERE`

**GitHub Repository:** `ADD_GITHUB_URL_HERE`

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 |
| UI | React 19 |
| Language | JavaScript |
| Styling | CSS |
| AI | OpenAI GPT-4o-mini |
| Agent Orchestration | Custom function-calling loop |
| API | Next.js API Route |
| Data | In-memory mock CRM |
| Validation | Custom refund-policy engine |
| Package Manager | npm |

### Why a custom agent loop?

For this assignment, a lightweight custom function-calling loop was used instead of introducing LangGraph or CrewAI.

The loop:

1. Sends the conversation and available tools to the model.
2. Detects tool calls.
3. Executes the requested application tool.
4. Returns the tool result to the model.
5. Repeats until the model produces a final response or the iteration limit is reached.

This keeps the implementation small, transparent, and easy to explain during the technical interview.

---

## 🧩 Development Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

---

## 🔮 Future Improvements

The following features could be added in a production version:

- Persistent database instead of in-memory mock data
- Real CRM integration
- Real payment/refund provider integration
- Authentication and admin RBAC
- Persistent audit logging
- Streaming agent activity
- Email notifications
- Voice interaction using OpenAI Realtime API, ElevenLabs, or LiveKit
- Analytics and operational metrics
- Webhook integrations
- Multi-language customer support

Voice interaction was intentionally kept as a bonus/future enhancement for this assignment so the required refund workflow could remain the primary focus.

---
```
---

## 🔐 Security Notes

- API keys are stored in environment variables.
- `.env.local` should never be committed.
- Mock CRM data is used for demonstration.
- Refund processing is simulated and does not move real money.
- The application should receive authentication, authorization, rate limiting, and persistent audit controls before production use.

---

## 📝 Assignment Scope

This project was built as a product vertical slice demonstrating:

```text
Customer Request
      ↓
CRM Lookup
      ↓
Policy Validation
      ↓
Agent Tool Orchestration
      ↓
Refund Decision
      ↓
Mock Refund Processing
      ↓
Admin Activity Visibility
```

The focus is on demonstrating reliable agent-tool orchestration, strict policy enforcement, graceful failure handling, and a clear customer/admin experience.

---

## 📄 License

This project is created for demonstration and assignment purposes.

---

<div align="center">

**RefundAI — AI Customer Support Agent**

Built with Next.js, React, JavaScript, and OpenAI.

</div>
