# Manga Reader Web

Platform baca manga online dengan fitur offline reading berdasarkan PRD yang telah ditentukan.

## Fitur Utama

- 📚 Browse dan cari manga
- 📖 Reader dengan image loading yang optimal
- 💾 Offline reading (download chapter)
- 📊 Reading progress tracking
- 👤 Sistem autentikasi user
- 📱 Progressive Web App (PWA)
- 🔐 Admin Panel untuk manage manga dan chapter

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Offline Storage**: IndexedDB
- **PWA**: Service Worker

## Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat database PostgreSQL, kemudian copy file environment:

```bash
copy .env.example .env
```

Edit `.env` dan sesuaikan `DATABASE_URL` dengan kredensial database Anda:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/manga_reader?schema=public"
```

### 3. Jalankan Migrasi Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. (Opsional) Seed Database dengan Data Demo

```bash
npx prisma db seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Folder

```
vsco/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── sw.js                  # Service Worker untuk PWA
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   ├── series/        # Manga series endpoints
│   │   │   ├── chapters/      # Chapter endpoints
│   │   │   ├── library/       # Library & sync endpoints
│   │   │   └── downloads/     # Download management
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── series/        # Manage series
│   │   │   ├── chapters/      # Manage chapters
│   │   │   └── page.tsx       # Admin dashboard
│   │   ├── browse/            # Browse page
│   │   ├── manga/[id]/        # Manga detail & reader
│   │   ├── library/           # User library
│   │   ├── login/             # Auth pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── indexeddb.ts       # IndexedDB utilities
│   └── middleware.ts          # Route protection
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## API Endpoints

### Series (Manga)
- `GET /api/series` - List semua series
- `GET /api/series/:id` - Detail series
- `GET /api/series/:id/chapters` - List chapter dalam series

### Chapters
- `GET /api/chapters/:chapterId` - Detail chapter
- `POST /api/chapters/:chapterId/download-token` - Generate token untuk download
- `GET /api/chapters/:chapterId/download-manifest` - Manifest untuk offline download

### Library
- `POST /api/library/sync-progress` - Sync reading progress dari offline ke server

### Downloads
- `GET /api/downloads/revoked` - Cek chapter yang sudah direvoke/takedown

### Admin API
- `POST /api/admin/series` - Tambah series baru
- `PUT /api/admin/series` - Update series
- `DELETE /api/admin/series?id=:id` - Hapus series
- `POST /api/admin/chapters` - Tambah chapter baru
- `PUT /api/admin/chapters` - Update chapter
- `DELETE /api/admin/chapters?id=:id` - Hapus chapter

## Cara Deploy & Hosting Online

### Opsi 1: Vercel (Recommended - Gratis)

1. **Push code ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Sign in dengan GitHub
   - Klik "New Project"
   - Import repository Anda
   - Tambahkan environment variables:
     - `DATABASE_URL`: PostgreSQL connection string
     - `NEXTAUTH_SECRET`: Generate dengan `openssl rand -base64 32`
     - `NEXTAUTH_URL`: URL production Anda
   - Klik "Deploy"

3. **Setup Database di Cloud**
   
   Gunakan salah satu:
   - **Supabase** (Gratis): [supabase.com](https://supabase.com)
   - **Neon** (Gratis): [neon.tech](https://neon.tech)
   - **Railway** (Gratis tier): [railway.app](https://railway.app)

   Copy connection string PostgreSQL dan masukkan ke Vercel environment variables.

4. **Jalankan Migrasi di Production**
   ```bash
   npx prisma migrate deploy
   ```

### Opsi 2: Railway

1. **Push ke GitHub** (sama seperti di atas)

2. **Deploy di Railway**
   - Buka [railway.app](https://railway.app)
   - Klik "Start a New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda
   - Railway akan otomatis detect Next.js

3. **Tambah PostgreSQL**
   - Di dashboard Railway, klik "New"
   - Pilih "Database" → "PostgreSQL"
   - Copy connection string
   - Tambahkan sebagai environment variable `DATABASE_URL`

4. **Setup Environment Variables**
   - `DATABASE_URL`: Auto-generated dari Railway PostgreSQL
   - `NEXTAUTH_SECRET`: Generate random string
   - `NEXTAUTH_URL`: URL dari Railway

### Opsi 3: VPS (Digital Ocean, Linode, dll)

1. **Setup Server**
   ```bash
   # Install Node.js, PostgreSQL, Nginx
   sudo apt update
   sudo apt install nodejs npm postgresql nginx
   ```

2. **Clone & Build**
   ```bash
   git clone <your-repo>
   cd vsco
   npm install
   npm run build
   ```

3. **Setup PM2 untuk Production**
   ```bash
   npm install -g pm2
   pm2 start npm --name "manga-reader" -- start
   pm2 startup
   pm2 save
   ```

4. **Setup Nginx sebagai Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL dengan Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Setelah Deploy

1. **Test website** - Buka URL production Anda
2. **Test offline mode** - Buka DevTools → Application → Service Workers
3. **Monitor** - Setup monitoring di Vercel/Railway dashboard

## Custom Domain

### Vercel
- Settings → Domains → Add yourdomain.com
- Update DNS records di domain provider Anda

### Railway
- Settings → Domains → Add Custom Domain
- Point CNAME record ke Railway

## Fitur yang Perlu Dikembangkan

Untuk production-ready, tambahkan:

1. **Konten Nyata**
   - Upload manga covers ke CDN (Cloudinary, AWS S3)
   - Populate database dengan manga dan chapter nyata

2. **Authentication**
   - Implementasi NextAuth.js lengkap
   - Social login (Google, GitHub)

3. **Payment/Subscription** (jika diperlukan)
   - Stripe/Midtrans integration

4. **CDN untuk Gambar**
   - Setup Cloudinary atau ImgBB untuk host images
   - Optimize image delivery

5. **Optimization**
   - Image optimization dengan CDN
   - Caching strategy
   - Rate limiting

## Admin Panel

Website sudah dilengkapi dengan Admin Panel untuk mengelola manga dan chapter.

### Akses Admin Panel

Buka `/admin` di browser Anda (contoh: `http://localhost:3000/admin`)

### Fitur Admin Panel

1. **Dashboard** (`/admin`)
   - Overview statistik (total series, chapters, users, views)
   - Latest series dan chapters
   - Quick actions

2. **Manage Series** (`/admin/series`)
   - List semua manga series
   - Filter berdasarkan status dan license
   - Add new series
   - Edit existing series
   - Delete series

3. **Manage Chapters** (`/admin/chapters`)
   - List semua chapters
   - Filter berdasarkan series
   - Add new chapter dengan upload images
   - Edit chapter
   - Delete chapter

### Cara Menambah Manga Baru

1. Buka `/admin/series/new`
2. Isi form:
   - Title (wajib)
   - Alternative title
   - Author & Artist (wajib)
   - Description (wajib)
   - Cover Image URL (wajib)
   - Status (ongoing/completed/hiatus)
   - License status
   - Centang "Allow Offline Download" jika perlu
   - Pilih genre
3. Klik "Create Series"

### Cara Menambah Chapter Baru

1. Buka `/admin/chapters/new`
2. Pilih series dari dropdown
3. Masukkan chapter number (bisa desimal, misal: 100.5)
4. (Opsional) Masukkan chapter title
5. **Upload Images:**
   - Upload gambar ke CDN (ImgBB, Cloudinary, Imgur)
   - Copy URL gambar
   - Paste URL di form dan klik "Add Image"
   - Ulangi untuk setiap halaman (urutan penting!)
   - Atau gunakan bulk upload: paste multiple URLs (satu per baris)
6. Klik "Publish Chapter"

### Rekomendasi CDN Gratis untuk Upload Images

1. **ImgBB** - https://imgbb.com
   - Gratis unlimited upload
   - Direct image URL
   - No signup required untuk basic use

2. **Cloudinary** - https://cloudinary.com
   - Free tier: 25GB storage
   - Image optimization otomatis
   - Perlu signup

3. **Imgur** - https://imgur.com
   - Gratis unlimited
   - Simple upload
   - Good for testing

### Tips Upload Images untuk Chapter

- Gunakan format WebP atau JPEG untuk ukuran file lebih kecil
- Resolusi recommended: 800-1200px width
- Upload gambar sesuai urutan halaman (Page 1, 2, 3, dst)
- Simpan URL dalam spreadsheet jika banyak chapter

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL running
- Cek format `DATABASE_URL` benar
- Verifikasi credentials

### Build Error
- Jalankan `npm install` lagi
- Hapus folder `.next` dan `node_modules`, install ulang

### Service Worker Not Working
- Pastikan menggunakan HTTPS di production
- Clear browser cache
- Check browser console untuk errors

## License

MIT

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.
