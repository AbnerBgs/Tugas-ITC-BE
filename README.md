# Sistem Manajemen Event & Tiket (RESTful API)

Proyek ini merupakan backend RESTful API untuk sistem manajemen event dan tiket (terinspirasi dari platform seperti Loket.com), dibangun untuk memenuhi Penugasan Divisi Back End **Information Technology Club (ITC)**.

API ini menyediakan fungsionalitas autentikasi berbasis JWT, kontrol akses berbasis peran (RBAC), manajemen kategori dan event, serta sistem pemesanan tiket dengan penanganan kuota yang aman menggunakan transaksi database (*atomic operation*).

---

## Daftar Fitur Utama

### Authentication & Authorization
- Register dan Login pengguna
- Autentikasi menggunakan JSON Web Token (JWT)
- Role-Based Access Control (RBAC) untuk role `ADMIN` dan `USER`
- Password hashing menggunakan Bcrypt

### Category Management (CRUD)
- Create, Read, Update, Delete kategori event
- Operasi tulis (`POST`, `PUT`, `DELETE`) dibatasi khusus untuk role `ADMIN`

### Event Management (CRUD)
- Melihat daftar event bersifat publik (dapat diakses tanpa login)
- Operasi tulis (`POST`, `PUT`, `DELETE`) dibatasi khusus untuk role `ADMIN`
- Setiap event memiliki atribut: `title`, `description`, `date`, `location`, `price`, `quota`, `categoryId`

### Booking System
- Pemesanan tiket oleh user dengan pemotongan kuota secara otomatis dan atomik menggunakan **Prisma Transaction**
- Riwayat booking milik user yang sedang login (`GET /api/bookings/my-bookings`)
- Rekap seluruh transaksi booking dari semua user untuk Admin (`GET /api/bookings/admin`)

---

## 🛠️ Tech Stack & Tools

| Kategori | Teknologi |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL |
| **ORM** | Prisma ORM |
| **Autentikasi** | JSON Web Token (`jsonwebtoken`) |
| **Keamanan Password** | Bcrypt |
| **Arsitektur Proyek** | Layered Architecture |

---

## Pohon Struktur Folder

Proyek ini menggunakan pendekatan *Layered Architecture* untuk memisahkan tanggung jawab tiap komponen, sehingga kode lebih terstruktur dan mudah dikembangkan.

```text
Tugas-ITC-BE/
├── docs/                      # Dokumentasi & ERD Diagram
│   └── ERD Tugas BE ITC.drawio.png
├── prisma/                    # Schema Prisma & Database Migrations
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/                # Inisialisasi Prisma Client
│   │   └── prisma.js
│   ├── controllers/           # Logika Bisnis Aplikasi
│   │   ├── authControllers.js
│   │   ├── bookingController.js
│   │   ├── categoryController.js
│   │   └── eventController.js
│   ├── middlewares/           # Middleware Authentikasi & Authorization
│   │   └── authMiddleware.js
│   ├── routes/                # Endpoint Routing
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── eventRoutes.js
│   └── app.js                 # Entry Point Aplikasi Express
├── .env                       # Environment Variables
├── .gitignore
├── package.json
└── README.md
