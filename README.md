# Meena Project(<https://www.instagram.com/themeenaproject/?hl=en>) - Nonprofit Fundraising Platform

## Tech Stack

## 🚧 Project Under Active Development 🚧

**Current Focus: Breadth over Depth & Learning New Technologies**

This project is currently in an active development phase. My primary focus at this stage is to explore and implement a wide range of features and integrate various technologies, many of which are new to me.

As such, you may notice:

- Features that are implemented but not yet fully polished or production-ready.
- Code that reflects an ongoing learning process (e.g., initial implementations that will be refactored later).
- Gaps in functionality or documentation as I prioritize getting core components working across the stack.

---

### Technologies Explored in this Project

**Backend:**

- **Python:** Flask, SQLAlchemy, Marshmallow, APScheduler
- **Databases:** PostgreSQL (with strong consistency, transactions, optimistic locking via SQLAlchemy-Continuum)
- **APIs:** Stripe, Mailjet, Google Maps API, amazon s3
- **Security:** JWT, Role-Based Access Control
- **Monitoring:** Logging for error handling, redis-cli monitor
- **Redis** Pub/Sub, MQ, SortedSets

**Frontend:**

- **React + Vite:** React Router, Tailwind CSS, Zustand

---

### Current Progress & Goals

- **Admin Flow:** Login/logout, campaign draft creation, email template management (thank you, reminder, closed), launching/closing campaigns, viewing historic donations/donors/campaigns, email stats.
- **Donor Flow:** One-time Stripe payments, anonymous donations, email subscription/unsubscribe.
- **General Features:** Reconciliation services (campaign amounts, email statuses, payment transactions) running asynchronously.

This project represents a significant learning endeavor, and I appreciate your understanding as it evolves.

---

| Layer        | Tech                         | Why?                                                             |
| ------------ | ---------------------------- | -----------------------------------------------------------------|
| **Backend**  | Flask, SQLAlchemy,Redis      | Lightweight, explicit control over ORM, SSE w/pubsub and MQ      |
| **Database** | PostgreSQL                   | ACID compliance, relational integrity                            |
| **Auth**     | JWT + RBAC                   | Role-based access for admins/donors                              |
| **Payments** | Stripe API                   | Idempotency keys, webhook reconciliation                         |
| **Email**    | Mailjet API                  | Open tracking, webhook reconciliation                            |
| **Frontend** | React + Vite + Zustand       | Modern, performant, global state management                      |

### **Core Architecture**

✅ **PostgreSQL** - Strong consistency for financial data  
✅ **Optimistic Locking** - Versioned reconciliation to prevent race conditions  
✅ **Event-Driven** - Webhooks (no polling) for Stripe/Mailjet  
✅ **Async Tasks** - APScheduler for background jobs

## Core Feature

### Admin Dashboard

| Feature             | Implementation Detail                                           |
| ------------------- | --------------------------------------------------------------- |
| Campaign Management | Draft → Launch → Close with version history                     |
| Email Automation    | Templated thank-you/reminder/closure flows                      |
| Donation Heatmaps   | Google Maps API                                                 |
| Donor Analytics     | Open rate tracking (emails sent/opened and subscription status) |
|                     |

### Donor Experience

- PCI-compliant Stripe payments (idempotency keys)
- Anonymous donation option (GDPR compliant)
- Thank you email successfuly completed payment

---

## UI

### Donor UI

<p align="center">
<img width="500" height="1261" alt="Image" src="https://github.com/user-attachments/assets/9d94abec-0ed8-46a1-9dea-03e498e3e705" />
</p>

### Admin UI

<p align="center">
<img width="500" height="1298" alt="Image" src="https://github.com/user-attachments/assets/b9e93293-cd18-4ccf-8860-c7e78142238e" />
<img width="500" height="1288" alt="Image" src="https://github.com/user-attachments/assets/58e80326-2319-450c-8415-213365b5349a" />

</p>
---

## Flow

### Donation Process Flow

1. **Donor Interaction**

    - Donor loads the donation landing page.
    - Frontend prompts for location consent (latitude/longitude).
    - Donor enters email, full name, chooses subscription options, and anonymity.
    - Donor submits the donation form.

2. **Backend Payment Initiation**

    - Backend receives donation request.
    - Backend creates a Stripe Checkout Session.
    - Payment model set to 'in progress' in the database.
    - Idempotency key generated and sent with Stripe payment request.

3. **Payment Execution & Webhook**
    - Donor completes payment via Stripe.
    - **IF Payment Success:**
      - Stripe webhook notifies the backend.
      - webhook API puts charge data on redis MQ
      - Workers pull from MQ and update payment status to 'succeeded' and campaign current amount.
      - Donor is navigated to a success page.
      - Via SSE donor will see new donoation on UI
      - Thank you email sent to donor (with unsubscribe option).
    - **IF Payment Failure:**
      - Stripe webhook notifies the backend.
      - Backend updates payment status to 'failed'.
      - Donor is navigated to a failure page.
