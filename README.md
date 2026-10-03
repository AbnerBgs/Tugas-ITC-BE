# Sistem Manajemen Event & Tiket (RESTful API)

Proyek ini merupakan backend RESTful API untuk sistem manajemen event dan tiket (terinspirasi dari platform seperti Loket.com), dibangun untuk memenuhi Penugasan Divisi Back End **Information Technology Club (ITC)**.

API ini menyediakan fungsionalitas autentikasi berbasis JWT, kontrol akses berbasis peran (RBAC), manajemen kategori dan event, serta sistem pemesanan tiket dengan penanganan kuota yang aman menggunakan transaksi database.

---

## Daftar Fitur Utama

- **Authentication & Authorization**
  - Register dan Login pengguna
  - Autentikasi menggunakan JSON Web Token (JWT)
  - Role-Based Access Control (RBAC) untuk role `ADMIN` dan `USER`
  - Password hashing menggunakan Bcrypt

- **Category Management (CRUD)**
  - Create, Read, Update, Delete kategori event
  - Operasi tulis (POST, PUT, DELETE) dibatasi khusus untuk role `ADMIN`

- **Event Management (CRUD)**
  - Melihat daftar event bersifat publik (dapat diakses tanpa login)
  - Operasi tulis (POST, PUT, DELETE) dibatasi khusus untuk role `ADMIN`
  - Setiap event memiliki atribut: `title`, `description`, `date`, `location`, `price`, `quota`, `categoryId`

- **Booking System**
  - Pemesanan tiket oleh user dengan pemotongan kuota secara otomatis dan atomik menggunakan Prisma Transaction
  - Riwayat booking milik user yang sedang login
  - Rekap seluruh transaksi booking untuk Admin

---

## Tech Stack & Tools

| Kategori | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL |
| ORM | Prisma ORM |
| Autentikasi | JSON Web Token (jsonwebtoken) |
| Keamanan Password | Bcrypt |

---

## Arsitektur Proyek

Proyek ini menggunakan pendekatan **Layered Architecture** untuk memisahkan tanggung jawab tiap komponen, sehingga kode lebih terstruktur, mudah diuji, dan mudah dikembangkan.

### Pohon Struktur Folder

```
├── config/
│   └── database.js          # Konfigurasi koneksi database / Prisma Client
│
├── controllers/
│   ├── auth.controller.js   # Logika bisnis autentikasi (register, login)
│   ├── category.controller.js
│   ├── event.controller.js
│   └── booking.controller.js
│
├── middlewares/
│   ├── auth.middleware.js   # Verifikasi JWT
│   └── role.middleware.js   # Pengecekan RBAC (ADMIN/USER)
│
├── routes/
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── event.routes.js
│   └── booking.routes.js
│
├── prisma/
│   ├── schema.prisma        # Definisi model database
│   └── migrations/          # Riwayat migrasi database
│
├── docs/
│   └── erd.png               # Dokumentasi ERD (Entity Relationship Diagram)
│
├── .env                      # Environment variables (tidak di-commit)
├── .env.example               # Contoh konfigurasi environment variables
├── app.js / server.js         # Entry point aplikasi
└── package.json
```

---

## Panduan Instalasi & Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root proyek (bisa menyalin dari `.env.example` jika tersedia), lalu isi sesuai konfigurasi lokal Anda:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"

# Server
PORT=5000

# JWT
JWT_SECRET="isi_dengan_secret_key_anda"
JWT_EXPIRES_IN="1d"
```

> Pastikan database MySQL sudah dibuat terlebih dahulu sebelum menjalankan migrasi.

### 4. Jalankan Prisma Migration

Generate Prisma Client dan terapkan skema ke database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Perintah di atas akan membuat seluruh tabel (`users`, `categories`, `events`, `bookings`) sesuai dengan `schema.prisma`.

Untuk melihat isi database secara visual melalui Prisma Studio:

```bash
npx prisma studio
```

### 5. Jalankan Aplikasi

Mode development (dengan auto-reload, jika menggunakan nodemon):

```bash
npm run dev
```

Mode production:

```bash
npm start
```

Server akan berjalan di `http://localhost:5000` (atau sesuai `PORT` pada `.env`).

---

## Dokumentasi API Endpoint

### Authentication

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Mendaftarkan akun pengguna baru |
| POST | `/api/auth/login` | Public | Login dan menghasilkan JWT token |

### Category

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/categories` | Public | Mengambil seluruh daftar kategori |
| GET | `/api/categories/:id` | Public | Mengambil detail satu kategori |
| POST | `/api/categories` | Admin | Membuat kategori baru |
| PUT | `/api/categories/:id` | Admin | Memperbarui data kategori |
| DELETE | `/api/categories/:id` | Admin | Menghapus kategori |

### Event

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/events` | Public | Mengambil seluruh daftar event |
| GET | `/api/events/:id` | Public | Mengambil detail satu event |
| POST | `/api/events` | Admin | Membuat event baru |
| PUT | `/api/events/:id` | Admin | Memperbarui data event |
| DELETE | `/api/events/:id` | Admin | Menghapus event |

### Booking

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/bookings` | User | Memesan tiket event (kuota dipotong otomatis via Prisma Transaction) |
| GET | `/api/bookings/my-bookings` | User | Melihat riwayat booking milik user yang sedang login |
| GET | `/api/bookings/admin` | Admin | Melihat rekap seluruh transaksi booking dari semua user |

> **Catatan Autentikasi:** Endpoint dengan akses `User` dan `Admin` memerlukan header `Authorization: Bearer <token>` yang diperoleh dari proses login.

---

## Dokumentasi ERD

Diagram ERD (Entity Relationship Diagram) dari sistem ini tersimpan di dalam folder [`docs/`](./docs). Diagram tersebut menggambarkan relasi antar tabel utama berikut:

- `users` — `bookings` (One-to-Many)
- `events` — `bookings` (One-to-Many)
- `categories` — `events` (One-to-Many)

Silakan buka folder `docs/` untuk melihat gambar ERD secara lengkap sebagai referensi struktur database tugas ini.

---
