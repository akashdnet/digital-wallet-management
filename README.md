# 💼 Digital Wallet Management System

A robust, role-based digital wallet system where **Users**, **Agents**, and **Admins** manage transactions, wallets, and system configurations. Built with **Express.js**, **TypeScript**, and **MongoDB**.

---

## 🛠️ Technology Stack

| Category | Tools |
|---------|-------|
| ⚙️ Runtime | Node.js |
| 🔧 Framework | Express.js |
| 🧠 Language | TypeScript |
| 🛢️ Database | MongoDB + Mongoose |
| 🛡️ Security | JWT, Bcrypt, Passport.js |
| 📦 Validation | Zod |
| ☁️ Storage | Cloudinary (for profile images) |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/akashdnet/digital-wallet-management.git
cd digital-wallet-management
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and add the following (refer to `example-env.txt`):
```env
PORT=5000
DB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
...
```

### 3. Run the Development Server
```bash
npm run dev
```

---

## 🌐 API Documentation

**Base URL:** `http://localhost:5000/api/v1`

### 🔐 Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required | Request Body/Types |
|:---:|:---|:---|:---:|:---|
| `POST` | `/login` | Login with credentials | No | `email (string), password (string)` |
| `POST` | `/logout` | Clear auth cookies | Yes | None |
| `POST` | `/refresh-token` | Refresh access token | Yes (Cookie) | None |

---

### 👤 User Routes (`/user`)

| Method | Endpoint | Description | Auth Required | Request Details |
|:---:|:---|:---|:---:|:---|
| `POST` | `/create` | Register a new user | No | **FormData**: `name`, `email`, `phone` (01XXXXXXXXX), `password` (min 8), `role` ('user'\|'agent'), `file` (avatar) |
| `GET` | `/me` | Get profile | Yes | Returns current user details |
| `PATCH` | `/me` | Update profile | Yes | **FormData**: `id`, `name`, `email`, `phone`, `file` (optional) |
| `PATCH` | `/change-password` | Change password | Yes | `id`, `oldPassword`, `newPassword`, `confirm_new_password` |

---

### 💰 Wallet Routes (`/wallet`)

| Method | Endpoint | Description | Auth | Request Body (JSON) |
|:---:|:---|:---|:---:|:---|
| `PATCH` | `/send-money` | Transfer funds | User | `amount` (string, >0), `to` (email OR phone) |
| `PATCH` | `/cash-out` | User to Agent | User | `amount` (string, >0), `to` (phone) |
| `PATCH` | `/cash-in` | Agent to User | Agent | `amount` (string, >0), `to` (phone) |
| `PATCH` | `/top-up` | Mobile Recharge | User/Agent | `amount` (string, >0), `to` (phone) |

> *Fees apply to `send-money` (fixed) and `cash-out` (percentage). `cash-in` and `top-up` are free.*

---

### 🛡️ Admin Routes (`/admin`)

| Method | Endpoint | Description | Type / Body |
|:---:|:---|:---|:---|
| `GET` | `/dashboard-overview` | System Overview | Stats (Users, Balances, etc.) |
| `PATCH` | `/update-wallet-status/:userId` | Change Wallet Status | `status`: 'active', 'blocked', 'pending' |
| `PATCH` | `/update-user-profile/:userId` | Edit Profile & Balance | `name`, `email`, `phone`, `balance` (unit: Taka), `password` (opt) |
| `DELETE` | `/delete-user/:userID` | Remove User | Param: `userID` |
| `GET` | `/user-list` | List regular users | Query: `page`, `limit` |
| `GET` | `/agent-list` | List agents | Query: `page`, `limit` |
| `GET` | `/pending-users` | New registrations | List |
| `GET` | `/pending-agents` | New agent requests | List |

---

### 📊 Transaction Routes (`/transaction`)

| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `GET` | `/all-transactions`| All system logs | Admin |
| `GET` | `/my-transactions` | Own logs | User/Agent |
| `GET` | `/:id` | Specific user logs | Admin |

---

### ⚙️ Service Charge Routes (`/service-charge`)

| Method | Endpoint | Description | Request Body |
|:---:|:---|:---|:---|
| `GET` | `/` | View settings | None |
| `PATCH` | `/` | Update settings | `sendMoneyCost` (number), `withdrawalFeePercentage` (number) |


---

## 🛡️ Role-Based Access Control (RBAC)

- **User**: Can send money, cash out, top-up, and view own transactions.
- **Agent**: Can cash-in to users and view own transaction history.
- **Admin**: Full control over users, agents, wallet status, and service charges.

## 📝 Features Note
- **Automatic Bonus**: New users receive 50 Taka upon registration (wallet starts as `pending`).
- **Validation**: All inputs are validated using **Zod** schemas.
- **Security**: Password hashing with Bcrypt and JWT-based session management using cookies.
- **Transaction History**: Every money movement is tracked with unique transaction IDs.

---

Built with ❤️ by [Akash](https://github.com/akashdnet)
