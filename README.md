# Meena Project

A real-time donation platform with admin dashboards, payment processing, and automated email campaigns.

## 🚀 Features

### Donor Flow

- Accept/reject providing location (Google Maps API)
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







- First-time use of several technologies (Redis, Stripe, SSE)
- Current focus: Improving production readiness

> **Note**: This project demonstrates rapid learning and implementation of complex systems. Several production-grade features are already implemented, with more enhancements planned.


DONOR FLOW

<img width="100"  alt="Image" src="https://github.com/user-attachments/assets/87eab711-e1df-4d3b-899f-d3bb3ef8e93c" />

<img width="100"  alt="Image" src="https://github.com/user-attachments/assets/3a792611-d0a5-45ec-ab2a-ddb49de4a85e" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/20c4340e-c13f-4212-854e-59054a5c105a" />

ADMIN FLOW

<img width="100"  alt="Image" src="https://github.com/user-attachments/assets/3b87ba42-577e-476b-ab53-4aa43e88afbe" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/39e51ddc-6c46-4a70-af11-b465bb600c7f" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/f50c0aa2-3aa7-489b-a539-878e20277561" />

<img width="100"  alt="Image" src="https://github.com/user-attachments/assets/6686a9b6-dd95-4a98-988c-5ff3666a15e8" />
