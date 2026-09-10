# RoycoBE - Card & Mobile Scan Result Server

Server backend mandiri untuk **Royko x AADC - Eggspresi Cinta**. Bertugas melayani halaman hasil kuis saat pengunjung melakukan scan QR Code melalui smartphone (`/result/:slug`), download kartu PNG resolusi tinggi, berbagi kartu ke media sosial, serta menyajikan aset statis (gambar kartu & font resmi Isidora).

> **Catatan Kiosk:** Seluruh pendaftaran peserta, pengerjaan kuis, penyimpanan data lokal, ekspor Excel, dan pencetakan struk termal (Blueprint BP-Q58D) ditangani secara offline langsung oleh aplikasi Kiosk (`FE`). Backend ini tidak memerlukan koneksi printer maupun database.

## 🛠️ Tech Stack
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Assets**: Static font Isidora & HD Card PNGs

## ⚙️ Konfigurasi .env
```env
PORT=5000
```

## 🚀 Cara Menjalankan
```bash
# 1. Masuk ke direktori BE
cd BE

# 2. Install dependencies
npm install

# 3. Jalankan mode development
npm run dev

# 4. Atau build & start untuk produksi
npm run build
npm start
```

Server akan aktif di `http://localhost:5000`.

## 📡 Daftar Endpoints
- `GET /health`: Healthcheck status server.
- `GET /result/:identifier`: Halaman web mobile hasil kuis (misal `/result/acts-of-service`) lengkap dengan tombol Download PNG & modal Share Sosial Media.
- `GET /api/cards`: Daftar 5 kartu Love Language statis (JSON).
- `GET /api/cards/:identifier`: Detail kartu spesifik berdasarkan ID (1-5) atau slug.
- `GET /`: Redirect otomatis ke `/result/acts-of-service`.

