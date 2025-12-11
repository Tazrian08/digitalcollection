# 📸 Digital Collection --- Professional Camera Gear E-Commerce Platform

Digital Collection is a full-stack **MERN e-commerce application**
designed for selling professional cameras, lenses, accessories, and
related gear.\
The platform includes a modern React/TypeScript frontend, a
Node.js/Express backend, MongoDB database, secure authentication,
dynamic category browsing, a product builder system, and a highly
polished UI inspired by premium e-commerce sites.

This project is fully deployed on a **Hostinger VPS (Ubuntu/Nginx/PM2)**
with a custom domain.

---

## 🚀 Live Demo

**Frontend:** https://digitalcollectioncamera.com

---

## 🛍️ Features

### **Frontend**

- ⚡ Built with **React + TypeScript + Vite**
- 🎨 Modern UI using **TailwindCSS**
- 🖼️ Elegant product cards with hover animations\
- 🧭 Category browsing with multi-word category support\
- 🧩 Camera & lens **Builder System**\
- 🖥️ Responsive hero sections, sliders, and image carousels\
- 📂 Dynamic product pages with key features, special features, blue
  tags\
- 🛒 Add to Cart flow with persistent localStorage data\
- 🔍 Search and category filtering

### **Backend**

- 🟢 **Node.js + Express**
- 🗄️ **MongoDB Atlas + Mongoose**
- 🔐 JWT-based authentication\
- 📦 Product, order, and transaction models\
- 📤 Image hosting support\
- 🔧 Admin endpoints for product CRUD

### **Deployment**

- 🚀 Hostinger VPS\
- 🌐 Nginx reverse proxy\
- 🔁 PM2 process manager\
- 🔐 Let's Encrypt SSL

---

## 🧱 Tech Stack

### **Frontend**

- React (TypeScript)
- Vite\
- TailwindCSS\
- Lucide Icons\
- React Router\
- Axios

### **Backend**

- Node.js\
- Express.js\
- Mongoose\
- MongoDB Atlas\
- JSON Web Tokens (JWT)\
- bcrypt

### **DevOps**

- Nginx\
- PM2\
- Hostinger VPS\
- GitHub

---

## 📂 Folder Structure

    digitalcollection/
    ├── backend/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── server.js
    │
    └── frontend/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── sections/
        │   ├── utils/
        │   ├── context/
        │   └── main.tsx
        └── index.html

---

## 🔧 Installation & Setup

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/Tazrian08/digitalcollection.git
cd digitalcollection
```

---

## ⚙️ Backend Setup (`/backend`)

### Install dependencies:

```bash
cd backend
npm install
```

### Create `.env`:

    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_secret
    PORT=5000

### Run backend:

```bash
npm run dev
```

---

## 🎨 Frontend Setup (`/frontend`)

### Install dependencies:

```bash
cd frontend
npm install
```

### Run frontend:

```bash
npm run dev
```

---

## 🌍 Deployment (Hostinger VPS)

- Clone repo\
- Configure Nginx reverse proxy\
- Build frontend and deploy to `/var/www/html`\
- Run backend using PM2\
- Apply SSL with Certbot\
- Restart Nginx

---

## 📌 Core Features Breakdown

### 🔹 Product System

- Name\
- Category\
- Images\
- Key Features\
- Special Features\
- Blue Tags\
- Price\
- Stock\
- Description

### 🔹 Product Builder

- Select camera body\
- Select compatible lens\
- Multi-word category support\
- Persistent localStorage logic

### 🔹 Cart & Checkout

- Update quantity\
- Remove items\
- Cart persistence

### 🔹 Admin Dashboard

- Add/Edit/Delete products\
- View transactions\
- Manage orders

---

## ✨ Author

**Tazrian Hossain**\
Portfolio: https://tazrian08.github.io/Portfolio\
GitHub: https://github.com/Tazrian08
