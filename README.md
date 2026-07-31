# RentNest 🏠

> Find & List Rental Properties with Ease

A full-stack rental property marketplace built with Next.js 14, TypeScript, Tailwind CSS, and Stripe payments.

## Live Demo

**Frontend:** https://5th-assignment-orcin.vercel.app

**Backend API:** https://fourth-assignment.onrender.com/api

## Admin Credentials

```
Email:    admin@rentnest.com
Password: admin123
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework, routing, server components |
| TypeScript | Type safety |
| Tailwind CSS | Styling & responsive design |
| React Hook Form + Zod | Form validation |
| TanStack Query | Server state & data fetching |
| Next.js Middleware | JWT auth & route protection |
| Stripe Checkout | Payment integration |
| Vercel | Deployment |

## Features

### Public
- Property grid with search and filters (location, price range, category, bedrooms)
- Property details page with landlord info and reviews
- Loading skeletons on all pages
- Toast notifications for all actions

### Auth
- Register as Tenant or Landlord with Zod validation
- Login with JWT stored in localStorage + cookies
- Role-based redirect after login
- Protected routes via Next.js Middleware

### Tenant Dashboard
- Browse and request rental properties
- Request history with status badges (PENDING / APPROVED / REJECTED / ACTIVE)
- Pay Now via Stripe Checkout on approved requests
- Leave reviews with star rating

### Landlord Dashboard
- Create, edit, and delete property listings
- Manage incoming rental requests (approve / reject)
- Platform stats overview

### Admin Dashboard
- Platform-wide stats (users, properties, rentals)
- User management — ban / unban users
- View all properties and rentals

## Roles

| Role | Description |
|---|---|
| Tenant | Browse, request rentals, pay, leave reviews |
| Landlord | Create and manage listings, approve/reject requests |
| Admin | Manage users, moderate platform |

## Running Locally

```bash
git clone https://github.com/kohinurfatema/5th-assignment.git
cd 5th-assignment
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://fourth-assignment.onrender.com/api
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
