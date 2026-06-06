# 🏠 HomeNest — Real Estate Listing Portal

HomeNest is a full-stack real estate listing platform where property owners can post rentals and sale listings, and users can browse, search, and filter properties.

## ✨ Features

- **Browse & Search Properties**: Explore all listings with backend-powered search by property name, filter by category (Rent/Sale/Commercial/Land/Villa etc.), and sort by price or date
- **Full Authentication**: Email/password and Google OAuth login via Firebase — with protected routes that persist session on page reload
- **Interactive Profile Settings**: Dedicated profile edit page (`/edit-profile`) to update display name and photo URL with a real-time preview and cross-layer state updates
- **Complete CRUD for Listings**: Add, update, and delete your own property listings with image support; delete confirmation via SweetAlert; instant UI updates
- **Ratings & Reviews System**: Leave 1–5 star ratings and written reviews on property detail pages; view all your past reviews on the My Ratings page
- **Light & Dark Mode**: Full theme switching with CSS variables — preference is saved across sessions via localStorage

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| React Router v6 | Client-side routing |
| Firebase Auth | Authentication |
| TanStack Query | Server state & caching |
| Axios | HTTP requests |
| Swiper.js | Hero carousel |
| SweetAlert2 | Confirmation dialogs |
| React Toastify | Toast notifications |
| React Icons | Icon library |

## 🚀 Getting Started

```bash
git clone <repo-url>
cd client
npm install
npm run dev
```

## 📁 Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home (slider + featured) | No |
| `/properties` | All Properties (search/sort/filter) | No |
| `/properties/:id` | Property Details + Reviews | Yes |
| `/add-property` | Add Property Form | Yes |
| `/my-properties` | My Listings (update/delete) | Yes |
| `/update-property/:id` | Edit Listing | Yes |
| `/my-ratings` | My Reviews | Yes |
| `/edit-profile` | Edit Profile Settings | Yes |
| `/login` | Login | No |
| `/register` | Register | No |
