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

> **Note**: This project demonstrates rapid learning and implementation of complex systems. Several production-grade features are already implemented, with more enhancements planned. Current optomizations and rewrites
- Front end refactor. Componentization and analaysis on when custom hooks, context api or store would be best suited
- Backend refactorof apis that are too tightly coupled, rely more on role based access control.
- Stripe payment security concerns with client side idempotency keys
- JWT token security concerns with storing in local storage. fine for temp testing but needs to be more protected. 


DONOR FLOW

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/15011f02-9171-4528-964e-0fb1aa9d298d" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/98b7af7c-aa3c-4508-9cb9-905dfd6e977a" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/20c4340e-c13f-4212-854e-59054a5c105a" />

ADMIN FLOW

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/c6fd5dd0-7f83-4c04-b772-098d6ab9454e" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/fc2f2915-0a57-4f16-a013-f55923ba0623" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/cc150cd1-735d-43b1-9dfe-2cf840cbfa53" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/751a608f-ee34-4b0c-b66a-781da9b200f0" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/c6213c53-1448-47d5-a195-8c07376ea2b5" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/8d61e086-689d-4db1-b6e3-1f92c47383bb" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/62c821d0-3a37-42c6-a4ed-62f474093583" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/058a1fde-1abc-4cd1-a53c-c939881f6efd" />

<img width="100" alt="Image" src="https://github.com/user-attachments/assets/0ece0241-371e-4159-aec1-c53579b6f08e" />
