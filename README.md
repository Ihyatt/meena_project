# Meena Project

A real-time donation platform with admin dashboards, payment processing, and automated email campaigns.

## 🚀 Features

### Donor Flow

- Accept/reject donations based on location (Google Maps API)
- Anonymous donation option
- Email subscription opt-in
- Stripe Checkout with webhook verification
- Real-time donation updates (SSE + Redis Pub/Sub)
- Automated email receipts via Mailjet

### Admin Dashboard

- Google Maps heatmap of donations
- 6-month donation analytics (individual + aggregated)
- Donor management table
- Email template system (receipts, impact reports, closeouts)
- Campaign management (create, share, activate/deactivate)

## 🛠️ Technologies

### Frontend

- React + JavaScript
- React Router
- Zustand (state management)
- Material Tailwind + Tailwind CSS
- Google Maps API
- Component-based authentication

### Backend

- Flask (Python)
- PostgreSQL + SQLAlchemy
- Redis:
  - Message queues
  - Sorted sets
  - Pub/Sub for SSE
  - Dead Letter Queue with exponential backoff retries
- SQL Continuum (versioning/optimistic locking)
- Marshmallow (serialization)
- Flask Blueprints
- Role-Based Access Control

### Integrations

- **Stripe API** (webhook signature verification)
- **Mailjet API** (transactional emails)
- **Amazon S3** (image uploads)
- **Ngrok** (webhook testing)

## 🔧 System Design Highlights

### Reliability Features

- Redis fallback to DB notifications if Pub/Sub fails
- Worker queues with:
  - Exponential backoff retries
  - Dead Letter Queue handling
- Optimistic locking for data consistency
- Webhook signature verification (Stripe/Mailjet)

### Monitoring

- Redis CLI monitoring (active)
- TODO: Prometheus + Grafana integration

## 📌 Coming Soon

- [ ] Automated scaling for worker queues
- [ ] Enhanced observability (Prometheus metrics)
- [ ] Comprehensive test suite
- [ ] Rate limiting for APIs

## 🏗️ Development Notes

- Built in 2.5 months with 2 weeks off
- First-time use of several technologies (Redis, Stripe, SSE)
- Current focus: Improving production readiness

> **Note**: This project demonstrates rapid learning and implementation of complex systems. Several production-grade features are already implemented, with more enhancements planned.

To view UI and flow --> <https://excalidraw.com/#json=NVzKdgtxa0izQCNrEG_nE,6745Dnp7jvstL9GxZH_QIw>
