# Quick Start - Deploy dalam 15 Menit

## 🚀 Langkah Cepat Deploy

### 1️⃣ Setup Neon Database (3 menit)
1. Buka https://neon.tech → Sign up gratis
2. Create Project → Pilih region Singapore
3. Copy connection string (postgresql://...)

### 2️⃣ Push ke GitHub (2 menit)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/manga-reader.git
git push -u origin main
```

### 3️⃣ Deploy ke Vercel (5 menit)
1. Buka https://vercel.com → Login dengan GitHub
2. Import project → Pilih repo manga-reader
3. Tambahkan 3 Environment Variables:
   - `DATABASE_URL` = [connection string dari Neon]
   - `NEXTAUTH_SECRET` = [random string 32 karakter]
   - `NEXTAUTH_URL` = https://[your-project].vercel.app
4. Klik Deploy!

### 4️⃣ Setup Database Tables (5 menit)
```bash
# Di laptop lokal
$env:DATABASE_URL="[paste dari Neon]"
npx prisma migrate deploy
npx prisma generate
```

### ✅ SELESAI!
Website Anda sudah online di: `https://[project-name].vercel.app`

---

## 📱 Test Website

1. **Homepage**: https://[project-name].vercel.app
2. **Admin Panel**: https://[project-name].vercel.app/admin
3. **Upload manga pertama** via admin panel

---

## 💰 Estimasi Biaya

### GRATIS (untuk mulai):
- Vercel: Free tier
- Neon: 0.5GB gratis (cukup untuk 500+ manga)
- ImgBB: Unlimited upload gratis
- **Total: $0/bulan**

### Setelah Beli Domain:
- Domain .com: ~$10/tahun (~Rp 12.000/bulan)
- Hosting tetap gratis
- **Total: ~Rp 12.000/bulan**

---

## 🎯 Rekomendasi Database

**PILIH NEON** ⭐⭐⭐⭐⭐
- Gratis 0.5GB (cukup lama)
- Serverless (auto-scale)
- Cepat & modern
- Partner resmi Vercel

**Alternatif:**
- Supabase (500MB free, lebih banyak fitur)
- Vercel Postgres (256MB free, terintegrasi)

---

## 📍 Rekomendasi Beli Domain

**Termurah:**
1. **Cloudflare** - $9/tahun (~Rp 140k/tahun)
2. **Namecheap** - $8-12/tahun (~Rp 120-180k/tahun)

**Di Indonesia:**
3. **Niagahoster** - Rp 15k-50k/tahun
4. **Rumahweb** - Rp 50k-100k/tahun

**Tips:** Cari yang ada promo first-year discount!

---

## 🆘 Troubleshooting Cepat

**Error: Database connection failed**
→ Cek connection string di Vercel environment variables

**Error: Build failed**
→ Pastikan semua dependencies terinstall: `npm install`

**Admin panel tidak bisa akses**
→ Normal, karena authentication belum disetup (bisa akses sementara)

---

## 📞 Bantuan Lebih Lanjut

Baca file lengkap:
- `DEPLOY_GUIDE.md` - Panduan detail deploy & domain
- `UPLOAD_GUIDE.md` - Tutorial upload manga & chapter
- `README.md` - Dokumentasi lengkap website

---

Website Anda siap go online! 🎉
