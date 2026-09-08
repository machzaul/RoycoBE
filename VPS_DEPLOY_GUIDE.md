# 🚀 Panduan Lengkap Deploy Backend (BE) ke VPS Linux (Ubuntu / Debian)

Dokumen ini berisi panduan *step-by-step* untuk men-deploy folder **`BE/`** ke VPS (Virtual Private Server) dengan PostgreSQL, PM2, Nginx, dan SSL gratis (HTTPS).

---

## 1. Persiapan Server VPS
Login ke VPS melalui terminal SSH:
```bash
ssh root@IP_VPS_ANDA
```

Update package repository:
```bash
sudo apt update && sudo apt upgrade -y
```

Install tools pendukung:
```bash
sudo apt install -y curl git nginx build-essential
```

---

## 2. Install Node.js (v20 LTS atau v22)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Pastikan v20+
npm -v
```

Install PM2 secara global:
```bash
sudo npm install -g pm2
```

---

## 3. Install & Konfigurasi PostgreSQL di VPS
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Buat user dan database untuk kuis:
```bash
# Masuk ke prompt postgres
sudo -u postgres psql

# Di dalam prompt PostgreSQL:
CREATE USER postgres WITH PASSWORD 'machzaul';
CREATE DATABASE royko_aadc OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE royko_aadc TO postgres;
\q
```

---

## 4. Upload / Clone Kode `BE/` ke VPS
Anda bisa clone via Git atau copy folder `BE` ke `/var/www/royko-be`:
```bash
sudo mkdir -p /var/www/royko-be
sudo chown -R $USER:$USER /var/www/royko-be
cd /var/www/royko-be

# Copy atau git clone file BE ke direktori ini
```

---

## 5. Konfigurasi `.env` di VPS
Buat file `.env` di `/var/www/royko-be/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:machzaul@localhost:5432/royko_aadc?schema=public"
ADMIN_PASSWORD="adminpass123"
PRINTER_NAME="Blueprint BP-Q58D"
CLIENT_URL="*"
```

---

## 6. Install Dependencies, Build, & Seed Data
```bash
cd /var/www/royko-be

# 1. Install dependencies
npm install

# 2. Generate Prisma Client & Push skema database
npm run prisma:generate
npm run prisma:push

# 3. Seed data kuis (5 Pertanyaan & 5 Kartu Love Language)
npm run prisma:seed

# 4. Build TypeScript ke JavaScript produksi
npm run build
```

---

## 7. Jalankan Backend dengan PM2
```bash
cd /var/www/royko-be
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
*Cek status server:* `pm2 status` atau `pm2 logs`

---

## 8. Konfigurasi Nginx (Reverse Proxy) & Domain
Buat file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/royko-be
```

Masukkan konfigurasi berikut (ganti `api.domainanda.com` dengan domain atau subdomain VPS Anda):
```nginx
server {
    listen 80;
    server_name api.domainanda.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/royko-be /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Pasang SSL Gratis (HTTPS Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.domainanda.com
```
Pilih opsi redirect HTTP ke HTTPS otomatis.

---

## 10. Hubungkan FE Kiosk Offline ke VPS Online
Di laptop/PC Kiosk event, buka file `FE/.env` dan ubah:
```env
NEXT_PUBLIC_ONLINE_URL="https://api.domainanda.com"
```
Sekarang, saat pengunjung kuis menyelesaikan sesi di layar Kiosk offline:
1. Layar Kiosk menampilkan QR Code yang mengarah ke:
   `https://api.domainanda.com/result/acts-of-service`
2. Pengunjung scan dari HP mereka (paket data seluler 4G/5G).
3. Halaman kartu langsung terbuka di HP mereka lengkap dengan tombol **Download Hasil Kartu** dan **Bagikan Ke Orang Tersayang**!
