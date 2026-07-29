# API Integration Guide

**Backend API Base URL:** `https://fourth-assignment.onrender.com/api`

This frontend connects to the RentNest backend built in Assignment 4.

---

## Authentication

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `auth/login/page.tsx` | POST | `/auth/login` | Login and receive JWT token |
| `auth/register/page.tsx` | POST | `/auth/register` | Register new tenant or landlord |

**Token Storage:** JWT is stored in `localStorage` and a cookie (for middleware route protection).

---

## Public Endpoints

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `(main)/page.tsx` | GET | `/properties` | Fetch featured properties for landing page |
| `(main)/properties/page.tsx` | GET | `/properties?location=&minPrice=&maxPrice=&bedrooms=&categoryId=` | Fetch and filter properties |
| `(main)/properties/[id]/page.tsx` | GET | `/properties/:id` | Fetch single property details |
| `(main)/properties/[id]/page.tsx` | GET | `/reviews/property/:id` | Fetch property reviews |
| `(main)/properties/page.tsx` | GET | `/categories` | Fetch all categories for filter dropdown |

---

## Tenant Endpoints

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `(main)/properties/[id]/page.tsx` | POST | `/rentals` | Submit rental request with moveInDate and message |
| `dashboard/tenant/page.tsx` | GET | `/rentals` | Fetch tenant's rental request history |
| `dashboard/tenant/page.tsx` | GET | `/payments` | Fetch tenant's payment history |
| `dashboard/tenant/requests/[id]/pay/page.tsx` | GET | `/rentals/:id` | Fetch rental request details for payment |
| `dashboard/tenant/requests/[id]/pay/page.tsx` | POST | `/payments/create` | Create Stripe checkout session |
| `dashboard/tenant/reviews/new/page.tsx` | POST | `/reviews` | Submit property review with rating and comment |

---

## Landlord Endpoints

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `dashboard/landlord/page.tsx` | GET | `/landlord/properties` | Fetch landlord's property listings |
| `dashboard/landlord/page.tsx` | DELETE | `/landlord/properties/:id` | Delete a property listing |
| `dashboard/landlord/properties/new/page.tsx` | POST | `/landlord/properties` | Create new property listing |
| `dashboard/landlord/properties/[id]/edit/page.tsx` | GET | `/properties/:id` | Fetch property data to pre-fill edit form |
| `dashboard/landlord/properties/[id]/edit/page.tsx` | PUT | `/landlord/properties/:id` | Update property listing |
| `dashboard/landlord/requests/page.tsx` | GET | `/landlord/requests` | Fetch all incoming rental requests |
| `dashboard/landlord/requests/page.tsx` | PATCH | `/landlord/requests/:id` | Approve or reject a rental request |

---

## Admin Endpoints

| Frontend Component | Method | Endpoint | Description |
|---|---|---|---|
| `dashboard/admin/page.tsx` | GET | `/admin/users` | Fetch all platform users |
| `dashboard/admin/page.tsx` | PATCH | `/admin/users/:id` | Ban or unban a user |
| `dashboard/admin/page.tsx` | GET | `/admin/properties` | Fetch all platform properties |
| `dashboard/admin/page.tsx` | GET | `/admin/rentals` | Fetch all platform rental requests |

---

## Payment Flow

```
Tenant clicks "Pay Now" on APPROVED request
  → GET /rentals/:id  (fetch rental details)
  → POST /payments/create  (create Stripe session → returns sessionUrl)
  → Redirect to Stripe Checkout
  → On success → /payment/success  (Stripe webhook updates backend automatically)
  → On cancel  → /payment/cancel
```

---

## Error Handling

All API errors are caught and displayed via **Sonner toast notifications**:
- `401` → Auto-redirect to `/auth/login`, token cleared
- `400` → Toast with server validation message
- `403` → Toast with forbidden message
- `500` → Generic error toast

Form validation errors are shown inline using **Zod + React Hook Form**.

---

## Admin Credentials

```
Email:    admin@rentnest.com
Password: admin123
```
