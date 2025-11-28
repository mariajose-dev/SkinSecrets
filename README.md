# SkinSecrets

A premium skincare e-commerce platform built with **Bootstrap 5**, **Material Design**, and **JavaScript + LocalStorage**.

## Features

- **User Authentication**: Registration and Login with LocalStorage persistence.
- **Product Management**: Admin can Add, Edit, and Delete skincare products (CRUD operations).
- **Shopping Cart**: Users can add items, update quantities, and remove items.
- **User Management**: Admin can view all registered users and their details.
- **Responsive Design**: Built with Bootstrap 5, custom Material Design components, and glassmorphism effects.
- **Static Site**: No backend required - runs entirely in the browser!

## Setup & Run

Direct File Access
Simply open `index.html` in your web browser.

## Pages Overview

- **Home (index.html)**: Landing page with hero banner, glassmorphism design, and featured categories.
- **Shop (shop.html)**: Displays all skincare products. Admins see Edit/Delete buttons.
- **Login (login.html)**: User login page.
- **Register (register.html)**: User registration page.
- **Add Product (add_product.html)**: Admin only page to add new skincare products.
- **Edit Product (edit_product.html)**: Admin only page to edit existing products.
- **Cart (cart.html)**: Shopping cart to manage selected items and checkout.
- **Users List (users.html)**: Admin only page to view all registered users.

## Admin Credentials

To access admin features (Add/Edit/Delete products, View Users), use the following credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5, Material Design (Material Icons, Cards, Glassmorphism)
- **Database**: LocalStorage (Browser-based)
- **CRUD Operations**: Fully implemented using JavaScript
- **Design**: Responsive glassmorphism UI with material design principles

## Data Persistence

All data (users, products, cart) is stored in the browser's LocalStorage:
- Data persists across page refreshes
- Each browser/device maintains separate data
- Clearing browser data will reset the application

## Demo Products

The application comes with 3 demo skincare products pre-loaded:
1. Glow Serum - ₹250
2. Hydrating Cream - ₹185
3. Sunscreen SPF 50 - ₹350

## Key Highlights

- **Glassmorphism UI**: Modern frosted glass effect with backdrop blur for a premium look
- **Material Design**: Google Material Icons and design principles throughout
- **Responsive**: Fully responsive design that works on desktop, tablet, and mobile
- **Admin Panel**: Complete admin functionality for product and user management
- **Cart System**: Full-featured shopping cart with quantity control and total calculations
- **Authentication**: Secure user registration and login system with role-based access

## Project Structure

```
SkinSecrets/
│
├── index.html              # Home page
├── shop.html               # Product listing page
├── login.html              # Login page
├── register.html           # Registration page
├── cart.html               # Shopping cart page
├── add_product.html        # Add product (Admin only)
├── edit_product.html       # Edit product (Admin only)
├── users.html              # User management (Admin only)
│
└── static/
    ├── style.css           # Custom styles
    └── script.js           # JavaScript logic for all pages
```

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Brave

---

**Note**: This is a client-side only implementation suitable for demos and learning. For production use, implement proper server-side authentication and database storage.
