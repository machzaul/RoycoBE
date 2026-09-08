# RoycoBE

Server backend REST API mandiri untuk **Royko x AADC - Eggspresi Cinta** menggunakan **Express.js**, **TypeScript**, dan **Prisma ORM** yang terhubung ke **PostgreSQL 18** (`royko_aadc`).

## 🛠️ Tech Stack
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 18
- **ORM**: Prisma ORM

## ⚙️ Konfigurasi .env
```env
PORT=5000
DATABASE_URL="postgresql://postgres:machzaul@localhost:5432/royko_aadc?schema=public"
ADMIN_PASSWORD="adminpass123"
PRINTER_NAME="Blueprint BP-Q58D"
CLIENT_URL="http://localhost:3000"
```

## 🚀 Cara Menjalankan
```bash
# 1. Masuk ke direktori BE
cd BE

# 2. Install dependencies (atau gunakan shared node_modules)
npm install

# 3. Sinkronkan skema Prisma (opsional jika sudah dilakukan di root)
npm run prisma:generate

# 4. Jalankan mode development
npm run dev
```

Server akan aktif di `http://localhost:5000`.

## 📡 Daftar Endpoints
- `GET /health`: Healthcheck status server.
- `GET /api/quizzes/active`: Mengambil kuis & pertanyaan yang sedang aktif.
- `POST /api/sessions/start`: Registrasi peserta & generate token sesi kuis.
- `POST /api/sessions/submit`: Kirim jawaban kuis, hitung love language, & assign antrean.
- `GET /api/sessions/result/:token`: Ambil hasil kuis via token QR code.
- `POST /api/sessions/print`: Cetak struk termal Blueprint BP-Q58D.
- `GET /api/cards`: Daftar 5 kartu Love Language statis.
- `GET /api/cards/:identifier`: Detail kartu berdasarkan ID (1-5) atau slug (acts-of-service, etc.).
- `GET /api/admin/analytics/summary`: Statistik total peserta & konversi.
- `GET /api/admin/analytics/distribution`: Distribusi hasil love language.
