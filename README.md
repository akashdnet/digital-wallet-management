---

# 💼 Digital Wallet Management System

Welcome! This project is a role-based digital wallet system where **Users**, **Agents**, and **Admins** have different powers and responsibilities. It's built with Express.js and MongoDB.

---


## 🛠️ Technology Stack

| Category | Tools |
|---------|-------|
| ⚙️ Runtime | Node.js |
| 🔧 Framework | Express.js |
| 🧠 Language | TypeScript |
| 🛢️ Database | MongoDB + Mongoose |
| 🛡️ Security | jwt, bcrypt |
| 📦 Others | cors, cookie-parser, zod, dotenv, etc. |

---



## 🚀 Getting Started

### Clone & Run
```bash
git clone https://github.com/akashdnet/digital-wallet-management.git
cd digital-wallet-management
npm run dev
```

> Before you start the server, make sure to create your `.env` file using the provided `example.env`.

---

## 🌐 Base URL

```
http://localhost:5000/api/v1/
```

---

## 👥 Roles & Features

### 👤 User
- Send money to other users 
- Cash out money from agents
- Cash in money via agents
- Top-up any valid BD number 
- Login using email/password or Google
- Create account (wallet starts with 50 Taka and `pending` status)
- Can only access and update their own profile and wallet info

### 🧑‍💼 Agent
- Cash-in money to users with active wallets
- Accept cash-out requests from users

### 🛡️ Admin
- View, update, or delete any user and wallet
- activate/block user wallets
- View all transactions
- Update transaction service charges

---

## 📦 API Routes

### 🔐 Auth Routes `/auth`
- `POST /login` — Login with credentials
- `GET /google` — Login using Google

---

### 🧍 User Routes `/user`
- `POST /create` — Create user account (auto wallet with 50 Taka, `pending`)
- `GET /all-users` — Get all users (admin only)
- `GET /:id` — View user details (admin or same user)
- `DELETE /:id` — Delete user account (admin or same user)
- `PATCH /:id` — Update user info (admin can edit anyone, user can edit themselves)

---

### 💰 Wallet Routes `/wallet`
- `GET /:id` — View wallet info (admin or self)
- `PATCH /status` — Admin changes wallet status (`pending`, `active`, `blocked`)
- `PATCH /send-money` — Send money to another user (includes service charge)
- `PATCH /top-up` — TopUp to any BD mobile number (no service charge)
- `PATCH /cash-in` — Agent sends money to user (no fee)
- `PATCH /cash-out` — User sends money to agent (includes service charge)

---

### 📄 Transaction Routes `/transactions`
- `GET /` — View all transactions (admin only)
- `GET /:id` — View a specific user's transactions (admin or same user)

---

### ⚙️ Service Charge Routes `/service-charge`
- `GET /` — View current service charges
- `PATCH /` — Update service charges (admin only)

---

## 📝 Featues Note
- Role-based access control
- Transaction management in a wallet system
- Secure login and Google Auth
- Service charge logic and ownership checks
- Admin has full access.
- Users are can view or partialy chang their own data and topup.
- All transactions and role-based permissions are protected through middleware checks.
- Wallet must be activated by Admin before transactions can begin.