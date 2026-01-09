# 🛒 Modern E-Commerce Web App

Aplikasi E-commerce modern berbasis web yang dibangun menggunakan **Next.js 15**, **Prisma**, **PostgreSQL**, dan **Tailwind CSS**. Sistem ini dilengkapi dengan manajemen stok otomatis, dashboard admin, dan fitur keranjang belanja.

---

## ✨ Fitur Utama
- **🛍️ Katalog Produk**: Pencarian cepat dan sistem pagination untuk efisiensi load data.
- **🛒 Keranjang Belanja**: Fitur tambah/kurang produk ke keranjang secara dinamis.
- **💳 Manajemen Order (Admin)**: 
    - Ubah status pesanan (Pending, Paid, Completed, Cancelled).
    - **Auto-Restock**: Stok otomatis kembali bertambah jika admin membatalkan pesanan yang sudah dibayar.
- **🔐 Autentikasi**: Login aman menggunakan NextAuth.js.
- **📱 Responsive Design**: Tampilan optimal di perangkat mobile maupun desktop.

---

## 🚀 Teknologi yang Digunakan
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: Auth.js (NextAuth)

---

## 🛠️ Langkah-Langkah Instalasi

Silakan salin dan jalankan perintah di bawah ini secara berurutan:

```bash
# 1. Clone repository ini
git clone [https://github.com/username-anda/nama-repo.git](https://github.com/username-anda/nama-repo.git)

# 2. Masuk ke dalam folder proyek
cd nama-repo

# 3. Install semua dependencies
npm install

# 4. Buat file .env dan masukkan konfigurasi berikut
# (Sesuaikan DATABASE_URL dengan kredensial PostgreSQL Anda)
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/db_ecommerce?schema=public\"
NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"
NEXTAUTH_URL=\"http://localhost:3000\"" > .env

# 5. Generate Prisma Client dan Sinkronisasi Database
npx prisma generate
npx prisma migrate dev --name init

# 6. Jalankan aplikasi dalam mode development
npm run dev