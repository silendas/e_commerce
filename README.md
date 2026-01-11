# 🛒 Modern E-Commerce with Midtrans Payment Gateway

Aplikasi E-commerce modern berbasis web yang dibangun menggunakan **Next.js 15**, **Prisma**, **PostgreSQL**, dan **Tailwind CSS**. Sistem ini dilengkapi dengan integrasi pembayaran **Midtrans Snap**, manajemen stok otomatis, dan sistem webhook untuk sinkronisasi status pesanan secara real-time.

---

## ✨ Fitur Utama
- **💳 Midtrans Integration**: Berbagai metode pembayaran (VA, E-Wallet, Kartu Kredit) via Midtrans Snap.
- **🔄 Real-time Webhook**: Update otomatis status dari `PENDING_PAYMENT` ke `PAID` via Webhook.
- **🛍️ Katalog Produk**: Performa tinggi dengan Next.js Server Components.
- **🔐 Secure Authentication**: Login aman menggunakan **Auth.js (NextAuth)**.
- **📦 Smart Inventory**: Stok berkurang otomatis saat lunas dan bertambah jika pesanan batal.

---

## 🚀 Teknologi yang Digunakan
- **Framework**: Next.js 15 (App Router)
- **Payment Gateway**: Midtrans Snap API
- **Database**: PostgreSQL | **ORM**: Prisma
- **Auth**: Auth.js (NextAuth) | **Styling**: Tailwind CSS

---

## 🛠️ Panduan Instalasi & Konfigurasi Lengkap

Silakan jalankan perintah di bawah ini secara berurutan dalam satu alur terminal:

```bash
# 1. Clone & Install Dependencies
git clone <url-repo-anda>
cd <nama-folder>
npm install

# 2. Setup Environment Variables (.env)
# PENTING: Ganti nilai di bawah ini sesuai dengan kredensial database, 
# Server Key Midtrans Anda, dan URL Ngrok yang sedang aktif (untuk AUTH_URL).
echo "DATABASE_URL=\"postgresql://USER:PASSWORD@localhost:5432/NAMA_DB?schema=public\"
AUTH_SECRET=\"$(openssl rand -base64 32)\"
AUTH_URL=\"https://url-web-anda.com\"
MIDTRANS_SERVER_KEY=\"GANTI-DENGAN-SERVER-KEY-ANDA\"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=\"GANTI-DENGAN-CLIENT-KEY-ANDA\"" > .env

# 3. Database & Prisma Setup
npx prisma generate
npx prisma migrate dev --name init

# 4. Jalankan Aplikasi
npm run dev