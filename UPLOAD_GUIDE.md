# Tutorial Lengkap: Upload Manga ke Website

## Persiapan

Sebelum mulai, pastikan Anda sudah:
1. Menjalankan website di `http://localhost:3000`
2. Memiliki gambar manga yang akan diupload
3. Akun di CDN gratis (ImgBB/Cloudinary/Imgur)

## Langkah 1: Upload Cover Manga ke CDN

1. Buka https://imgbb.com
2. Klik "Start uploading"
3. Upload cover image manga Anda
4. Setelah upload, klik kanan pada gambar → "Copy image address"
5. Simpan URL ini (contoh: `https://i.ibb.co/xxxxx/cover.jpg`)

## Langkah 2: Tambah Series Baru

1. Buka browser ke `http://localhost:3000/admin/series/new`
2. Isi form dengan data manga:
   ```
   Title: One Piece
   Alternative Title: ワンピース
   Author: Eiichiro Oda
   Artist: Eiichiro Oda
   Description: Monkey D. Luffy bermimpi menjadi Raja Bajak Laut...
   Cover Image URL: [paste URL dari step 1]
   Status: Ongoing
   License Status: Original
   ✓ Allow Offline Download
   Genres: [pilih Action, Adventure, Fantasy]
   ```
3. Klik "Create Series"
4. Series berhasil ditambahkan!

## Langkah 3: Upload Gambar Chapter ke CDN

Untuk setiap chapter, Anda perlu upload semua halaman ke CDN terlebih dahulu.

### Cara Manual (untuk chapter dengan sedikit halaman):
1. Buka https://imgbb.com
2. Upload halaman 1
3. Copy URL gambar
4. Ulangi untuk halaman 2, 3, dst
5. Simpan semua URL di notepad

### Cara Batch (untuk chapter dengan banyak halaman):
1. Buka https://imgbb.com
2. Upload multiple images sekaligus (drag & drop)
3. Setelah semua upload, copy URL satu per satu
4. Atau gunakan Cloudinary yang support bulk upload

## Langkah 4: Tambah Chapter Baru

1. Buka `http://localhost:3000/admin/chapters/new`
2. Pilih series dari dropdown (contoh: One Piece)
3. Isi Chapter Number: `1`
4. (Opsional) Chapter Title: `Romance Dawn`
5. Tambah images:
   
   **Cara 1 - Satu per satu:**
   - Paste URL gambar halaman 1
   - Klik "Add Image"
   - Paste URL gambar halaman 2
   - Klik "Add Image"
   - Ulangi untuk semua halaman
   
   **Cara 2 - Bulk upload:**
   - Scroll ke bagian "Bulk Upload"
   - Paste semua URL sekaligus (satu URL per baris):
     ```
     https://i.ibb.co/xxxxx/page-1.jpg
     https://i.ibb.co/xxxxx/page-2.jpg
     https://i.ibb.co/xxxxx/page-3.jpg
     ```
   - Klik di luar textarea, images akan ditambahkan otomatis

6. Pastikan urutan halaman benar (Page 1, 2, 3, dst)
7. Klik "Publish Chapter"
8. Chapter berhasil dipublish!

## Langkah 5: Test Chapter di Website

1. Buka homepage `http://localhost:3000`
2. Cari manga yang baru Anda tambahkan
3. Klik manga → lihat detail dan list chapter
4. Klik chapter → test reader
5. Pastikan semua gambar tampil dengan benar

## Tips & Tricks

### Untuk Upload Banyak Chapter Sekaligus:

1. **Organisir file dengan baik:**
   ```
   manga-uploads/
   ├── one-piece/
   │   ├── covers/
   │   │   └── cover.jpg
   │   ├── chapter-001/
   │   │   ├── page-01.jpg
   │   │   ├── page-02.jpg
   │   │   └── ...
   │   ├── chapter-002/
   │   │   ├── page-01.jpg
   │   │   └── ...
   ```

2. **Gunakan spreadsheet untuk track URLs:**
   ```
   Chapter | Page | URL
   1       | 1    | https://i.ibb.co/xxx/ch1-p1.jpg
   1       | 2    | https://i.ibb.co/xxx/ch1-p2.jpg
   2       | 1    | https://i.ibb.co/xxx/ch2-p1.jpg
   ```

3. **Batch upload ke Cloudinary:**
   - Cloudinary support folder structure
   - Upload semua gambar chapter sekaligus
   - Auto-generate URLs dengan pattern

### Rekomendasi Format Gambar:

- **Format**: WebP (ukuran kecil) atau JPEG (kompatibilitas tinggi)
- **Resolusi**: 800-1200px width
- **Ukuran file**: Max 2MB per gambar untuk loading cepat
- **Naming**: `page-01.jpg`, `page-02.jpg` (untuk mudah track)

### CDN Comparison:

| CDN | Storage | Speed | Ease of Use | Best For |
|-----|---------|-------|-------------|----------|
| ImgBB | Unlimited | Fast | ⭐⭐⭐⭐⭐ | Quick testing |
| Cloudinary | 25GB free | Very Fast | ⭐⭐⭐⭐ | Production use |
| Imgur | Unlimited | Fast | ⭐⭐⭐⭐⭐ | Simple uploads |

## Troubleshooting

### Gambar tidak muncul di reader?
- Cek apakah URL gambar benar dan accessible
- Buka URL gambar di browser baru untuk test
- Pastikan CDN tidak block hotlinking

### Chapter tidak muncul di list?
- Refresh halaman
- Cek di admin panel apakah chapter sudah tersimpan
- Cek console browser untuk error

### Upload gambar lambat?
- Compress gambar sebelum upload (gunakan TinyPNG)
- Upload di waktu internet stabil
- Gunakan CDN dengan server terdekat

## Contoh Workflow Production

1. **Persiapan konten** (1 jam)
   - Download/scan manga chapter
   - Crop dan resize gambar
   - Compress untuk web

2. **Upload ke CDN** (30 menit)
   - Batch upload semua halaman
   - Copy semua URLs

3. **Input ke admin panel** (10 menit)
   - Paste URLs ke form
   - Publish chapter

4. **Quality check** (5 menit)
   - Test baca chapter
   - Cek semua gambar loading

Total: ~2 jam per chapter (20-30 halaman)

## Script Otomasi (Advanced)

Untuk yang familiar dengan programming, bisa buat script untuk automasi:

```javascript
// upload-chapter.js - Contoh script untuk batch upload
const chapters = [
  {
    seriesId: '1',
    chapterNumber: 1,
    title: 'Chapter 1',
    images: [
      'https://cdn.com/ch1-p1.jpg',
      'https://cdn.com/ch1-p2.jpg',
      // ... more pages
    ]
  }
]

// POST ke /api/admin/chapters untuk setiap chapter
```

Simpan script ini dan jalankan dengan Node.js untuk upload batch chapters.
