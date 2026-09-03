# Panduan Deploy ke Vercel + Neon Database

## Step 1: Persiapan Code

1. **Push ke GitHub** (jika belum)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Manga Reader Website"
   
   # Buat repository baru di github.com, lalu:
   git remote add origin https://github.com/username/manga-reader.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Setup Database di Neon

1. **Buka** https://neon.tech
2. **Sign up** dengan GitHub (gratis)
3. **Create New Project**
   - Project name: `manga-reader`
   - Region: Pilih yang terdekat (Singapore untuk Indonesia)
   - PostgreSQL version: 16 (latest)
4. **Copy Connection String**
   - Setelah project dibuat, klik "Connection Details"
   - Copy connection string yang formatnya:
     ```
     postgresql://username:password@ep-xxxx.region.neon.tech/neondb?sslmode=require
     ```
   - SIMPAN ini, akan dipakai di Vercel

## Step 3: Deploy ke Vercel

1. **Buka** https://vercel.com
2. **Sign up/Login** dengan GitHub
3. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository `manga-reader` dari GitHub
   - Klik "Import"

4. **Configure Project**
   - Framework Preset: Next.js (auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Environment Variables** - PENTING!
   Tambahkan 3 environment variables:
   
   **DATABASE_URL**
   ```
   [paste connection string dari Neon]
   ```
   
   **NEXTAUTH_SECRET**
   ```
   [generate dengan command di bawah atau gunakan random string panjang]
   ```
   Cara generate di Windows PowerShell:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   Atau gunakan online: https://generate-secret.vercel.app/32
   
   **NEXTAUTH_URL**
   ```
   https://[project-name].vercel.app
   ```
   (Ganti [project-name] dengan nama project Vercel Anda)
   (Nanti bisa diganti ke custom domain setelah beli domain)

6. **Deploy!**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Vercel akan build dan deploy otomatis

## Step 4: Setup Database Tables (Migrasi)

Setelah deploy berhasil, Anda perlu jalankan migrasi database:

**Cara 1 - Via Local (Recommended):**
```bash
# Di laptop lokal, set environment variable
$env:DATABASE_URL="[paste connection string dari Neon]"

# Jalankan migrasi
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Cara 2 - Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Jalankan migrasi
vercel env pull .env
npx prisma migrate deploy
```

## Step 5: Test Website

1. Buka URL Vercel Anda: `https://[project-name].vercel.app`
2. Test homepage - harus loading
3. Buka admin panel: `https://[project-name].vercel.app/admin`
4. Test tambah manga dan chapter

## Step 6: Beli dan Setup Custom Domain (Opsional)

### A. Beli Domain

**Rekomendasi Domain Provider:**
- **Namecheap** - $8-12/tahun - https://namecheap.com
- **Niagahoster** (Indonesia) - Rp 15.000-50.000/tahun - https://niagahoster.co.id
- **Cloudflare** - $9/tahun (paling murah) - https://cloudflare.com
- **GoDaddy** - $12-15/tahun - https://godaddy.com

**Tips:**
- Pilih domain `.com` untuk profesional
- Atau `.id` jika target Indonesia
- Cek promo first-year discount
- Jangan lupa renewal fee (biasanya lebih mahal tahun kedua)

### B. Connect Domain ke Vercel

1. **Di Vercel Dashboard:**
   - Pilih project Anda
   - Settings → Domains
   - Klik "Add Domain"
   - Masukkan domain Anda: `mangareader.com`

2. **Vercel akan kasih instruksi DNS:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Update DNS di Domain Provider:**
   - Login ke Namecheap/Niagahoster/dll
   - Masuk ke DNS Management
   - Tambahkan/update record sesuai instruksi Vercel
   - Save

4. **Wait for Propagation:**
   - DNS propagation biasanya 5-10 menit
   - Bisa sampai 24 jam (jarang)
   - Cek status di Vercel dashboard

5. **Update Environment Variable:**
   - Vercel → Settings → Environment Variables
   - Edit `NEXTAUTH_URL` jadi: `https://mangareader.com`
   - Redeploy project (Deployments → ... → Redeploy)

6. **SSL Certificate (Otomatis):**
   - Vercel otomatis provide SSL/HTTPS gratis
   - Website akan accessible via `https://mangareader.com`

## Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solusi:**
- Pastikan connection string benar
- Cek apakah Neon database masih aktif
- Pastikan ada `?sslmode=require` di akhir connection string

### Build Failed di Vercel
```
Error: Cannot find module '@prisma/client'
```
**Solusi:**
- Pastikan prisma sudah di dependencies (bukan devDependencies)
- Commit ulang dan push

### Prisma Migration Error
```
Error: Schema engine error
```
**Solusi:**
- Jalankan `npx prisma generate` dulu
- Lalu `npx prisma migrate deploy`

### Admin Panel Tidak Bisa Akses
**Solusi:**
- Implementasi authentication dulu
- Atau temporary disable middleware check (edit src/middleware.ts)

## Monitoring & Maintenance

### 1. Cek Database Usage (Neon)
- Buka Neon dashboard
- Lihat storage usage di Overview
- Free tier: 0.5GB (cukup untuk ~500-1000 manga)

### 2. Cek Vercel Analytics
- Vercel dashboard → Analytics
- Monitor traffic, performance
- Free tier: 100GB bandwidth/bulan

### 3. Backup Database
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Atau gunakan Neon dashboard → Backup & Restore
```

## Estimasi Biaya

### Fase 1: Testing (0-1000 users/hari)
- **Hosting**: Vercel Free - $0
- **Database**: Neon Free - $0
- **Domain**: $10/tahun
- **CDN Images**: ImgBB Free - $0
- **Total**: ~$1/bulan (domain aja)

### Fase 2: Growth (1000-10000 users/hari)
- **Hosting**: Vercel Pro - $20/bulan
- **Database**: Neon Scale - $19/bulan
- **Domain**: $10/tahun
- **CDN**: Cloudinary Pro - $89/bulan (atau tetap ImgBB free)
- **Total**: ~$40-130/bulan

### Fase 3: Scale (10000+ users/hari)
- **Hosting**: Vercel Pro - $20/bulan
- **Database**: Neon Business - $69/bulan
- **CDN**: Cloudinary Advanced - $224/bulan
- **Total**: ~$300/bulan

## Tips Hemat Biaya

1. **Optimize Images**
   - Compress sebelum upload (TinyPNG)
   - Gunakan WebP format
   - Lazy loading di reader

2. **CDN Gratis Maksimal**
   - ImgBB: unlimited free
   - Imgur: unlimited free
   - Cloudinary: 25GB free (cukup lama)

3. **Caching Strategy**
   - Enable Vercel Edge Caching
   - Cache manga list di browser (localStorage)
   - Progressive Web App (PWA) untuk offline

4. **Database Optimization**
   - Index pada kolom yang sering di-query
   - Pagination untuk list manga
   - Soft delete untuk archived content

## Next Steps After Deploy

1. ✅ Setup domain custom
2. ✅ Upload 5-10 manga pertama via admin panel
3. ✅ Test semua fitur (browse, read, offline)
4. ✅ Share ke teman untuk feedback
5. ✅ Setup Google Analytics (optional)
6. ✅ Add meta tags untuk SEO
7. ✅ Submit ke Google Search Console

Selamat! Website manga Anda sudah online dan bisa diakses dunia! 🎉
