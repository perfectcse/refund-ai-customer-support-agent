1. Project Name
 RefundAI — AI-Powered Customer Support Agent

 The product concept:
 An AI customer-support agent that identifies customers, retrieves order information, validates refund requests against a strict refund policy, and either approves or denies the refund using tool calling.

 2. Core Features
We should divide features into MVP and Bonus.

1.  Customer side
2.  Customer chat interface
3.  Customer selection/login
4.  Ask for refund
5.  AI understands the request
6.  Agent identifies customer
7.  Agent retrieves order
8.  Agent checks refund policy
9.  Agent calculates eligible refund
10. Agent approves/denies refund
11. Clear explanation to customer

Admin side
Dashboard
Agent status
Current conversation
Tool execution logs
Policy validation result
Refund decision
Error/retry events
Timestamped activity

Backend/Agent
Next.js Route Handler
LLM
Agent loop
Tool calling
Mock CRM
Refund policy engine
Error handling
Structured logs

                    ┌─────────────────────┐
                    │    Customer UI      │
                    │    Next.js / React  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  /api/agent         │
                    │  Next.js Server     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     AI Agent        │
                    │   Agent Loop        │
                    └──────────┬──────────┘
                               │
                  ┌────────────┼────────────┐
                  ▼            ▼            ▼
             getCustomer   getOrder   checkPolicy
                  │            │            │
                  └────────────┼────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  Refund Decision    │
                    │ APPROVE / DENY      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Activity Logs     │
                    │   Admin Dashboard   │
                    └─────────────────────┘


                    | Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | **Next.js**                   |
| UI        | **React**                     |
| Language  | **JavaScript**                |
| Styling   | CSS / Tailwind if needed      |
| Agent     | LLM + tool calling            |
| Backend   | **Next.js server/API routes** |
| Database  | Mock CRM data                 |
| Policy    | Local policy document/data    |
| Admin     | Next.js dashboard             |
| Voice     | Optional bonus                |
