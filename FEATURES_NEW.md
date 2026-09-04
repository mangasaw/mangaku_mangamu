# Fitur Baru yang Ditambahkan

Dokumentasi untuk fitur-fitur baru yang telah diimplementasikan di Manga Reader Web.

## 1. Ad Optimization

Sistem manajemen iklan yang optimal dengan penempatan strategis.

### Fitur:
- **Admin Panel untuk Iklan** (`/admin/ads`)
  - Kelola semua iklan dari satu dashboard
  - Filter berdasarkan status dan posisi
  - Tracking impressions dan CTR
  - Toggle aktif/nonaktif iklan
  
- **Posisi Iklan:**
  - `HEADER` - Bagian atas halaman
  - `SIDEBAR_LEFT` - Sidebar kiri (desktop)
  - `SIDEBAR_RIGHT` - Sidebar kanan (desktop)
  - `BEFORE_CONTENT` - Sebelum konten utama
  - `AFTER_CONTENT` - Setelah konten selesai
  - `FOOTER` - Bagian bawah halaman
  - `INLINE` - Disisipkan setiap 5 halaman chapter (CTR tertinggi)

- **Ad Rotation:** Sistem otomatis rotate iklan jika ada beberapa iklan di posisi yang sama

### Cara Menggunakan:
1. Buka `/admin/ads`
2. Klik "Tambah Iklan Baru"
3. Isi nama iklan, pilih posisi, dan paste kode HTML/JavaScript dari provider
4. Aktifkan iklan
5. Monitor performa dari dashboard

### Supported Ad Networks:
- Google AdSense
- Media.net
- Custom HTML banners
- Any JavaScript-based ad code

---

## 2. Reading Modes

4 mode baca yang berbeda untuk pengalaman optimal.

### Mode Tersedia:

#### Vertical (Default)
- Scroll ke bawah untuk halaman berikutnya
- Cocok untuk baca santai
- Ads muncul di awal dan akhir chapter

#### Horizontal
- Swipe kiri/kanan atau gunakan arrow keys
- Satu halaman per layar
- Cocok untuk manga tradisional

#### Double Page
- Dua halaman sekaligus seperti buku fisik
- Cocok untuk spread pages
- Desktop experience terbaik

#### Webtoon
- Infinite scroll tanpa jeda
- Optimized untuk webtoon/manhwa
- Mobile-friendly

### Cara Menggunakan:
1. Buka chapter apa saja
2. Klik tombol "⚙️ Settings" di header
3. Pilih mode baca yang diinginkan
4. Pengaturan tersimpan otomatis di browser

### Keyboard Shortcuts:
- `←` / `→` : Previous/Next page (horizontal/double-page)
- `↑` / `↓` : Previous/Next page
- `S` : Toggle settings panel

---

## 3. Gesture Controls

Kontrol touch-friendly untuk mobile dan tablet.

### Touch Gestures:

#### Swipe
- **Swipe Left:** Next page (horizontal/double-page mode)
- **Swipe Right:** Previous page
- **Swipe Up/Down:** Scroll (vertical/webtoon mode)

#### Tap & Double Tap
- **Single Tap:** Toggle settings panel
- **Double Tap:** Zoom in/out (1x ↔ 1.5x)

#### Pinch
- **Pinch In:** Zoom out
- **Pinch Out:** Zoom in
- Range: 0.5x - 3x

### Desktop Support:
- **Mouse Click:** Same as tap
- **Double Click:** Zoom
- **Ctrl + Wheel:** Zoom in/out

### Fitur:
- Smooth animations
- Touch-optimized button sizes (min 44x44px)
- Gesture hints untuk first-time users
- Tidak conflict dengan browser gestures

---

## 4. Bulk Upload

Upload beberapa chapter sekaligus untuk efisiensi maksimal.

### Cara Menggunakan:

#### Method 1: Manual Input
1. Buka `/admin/chapters/bulk`
2. Pilih series
3. Klik "Tambah Chapter" untuk setiap chapter
4. Input chapter number, title, dan images
5. Klik "Upload X Chapter(s)"

#### Method 2: Quick Bulk Parser (Recommended)
1. Buka `/admin/chapters/bulk`
2. Pilih series
3. Di section "Quick Bulk Parser", paste URLs dengan format:

**Format 1 (Simple):**
```
https://example.com/ch1-page1.jpg
https://example.com/ch1-page2.jpg
https://example.com/ch1-page3.jpg
```

**Format 2 (Multiple Chapters):**
```
1|https://example.com/ch1-page1.jpg
1|https://example.com/ch1-page2.jpg
1|https://example.com/ch1-page3.jpg
2|https://example.com/ch2-page1.jpg
2|https://example.com/ch2-page2.jpg
```

4. Klik "Parse URLs"
5. System akan otomatis membuat chapters
6. Klik "Upload X Chapter(s)"

### Fitur:
- Upload sampai ratusan chapter sekaligus
- Progress indicator real-time
- Auto-detect duplicate chapters
- Error handling per-chapter (gagal 1 tidak mempengaruhi yang lain)
- Rate limiting protection (500ms delay antar upload)

### Tips:
- Persiapkan semua URLs dalam spreadsheet/text file
- Gunakan format `chapter|url` untuk bulk upload multiple chapters
- Test dengan 1-2 chapter dulu sebelum bulk upload besar
- Upload saat traffic rendah untuk menghindari timeout

---

## API Endpoints Baru

### Ads Management
- `GET /api/ads` - List all ads
- `POST /api/ads` - Create new ad
- `GET /api/ads/[id]` - Get single ad
- `PUT /api/ads/[id]` - Update ad
- `DELETE /api/ads/[id]` - Delete ad
- `GET /api/ads/active?position=X` - Get active ad for position

### Chapters
- `POST /api/admin/chapters` - Create chapter (supports bulk)
- `PUT /api/admin/chapters` - Update chapter
- `DELETE /api/admin/chapters?id=X` - Delete chapter
- `GET /api/chapters/[chapterId]` - Get chapter with view tracking

### Series
- `GET /api/series` - List all series (for dropdowns)

---

## Database Changes

Schema Prisma sudah include:
- `Ad` model dengan positions dan tracking
- `UserPreference` model untuk reading modes dan gestures
- Chapter view tracking
- Ad impressions dan clicks tracking

Tidak perlu migrasi baru jika schema sudah sesuai dengan yang ada di `prisma/schema.prisma`.

---

## Konfigurasi

### Enable/Disable Features

Di `.env`:
```env
# Ads
ENABLE_ADS=true

# Reading Modes (all enabled by default)
ENABLE_READING_MODES=true

# Gestures
ENABLE_GESTURES=true

# Bulk Upload
ENABLE_BULK_UPLOAD=true
```

### Ad Optimization Settings

Best practices:
- Maximum 1-2 ads per position
- INLINE ads setiap 5 pages (highest CTR)
- Test different positions untuk series berbeda
- Monitor CTR dan disable low-performing ads

### Reading Mode Defaults

User preferences tersimpan di localStorage:
- Default mode: `vertical`
- Default auto-next: `true`
- Default gestures: `enabled`

---

## Testing

### Manual Testing Checklist:

**Ad Optimization:**
- [ ] Create ad dari admin panel
- [ ] Ad muncul di posisi yang benar
- [ ] Toggle active/inactive works
- [ ] Delete ad works
- [ ] Multiple ads rotation works

**Reading Modes:**
- [ ] Vertical mode scroll works
- [ ] Horizontal mode swipe works
- [ ] Double page displays 2 pages
- [ ] Webtoon infinite scroll works
- [ ] Mode preference saves

**Gesture Controls:**
- [ ] Swipe left/right navigates
- [ ] Double tap zooms
- [ ] Pinch zooms
- [ ] Keyboard shortcuts work
- [ ] Desktop mouse gestures work

**Bulk Upload:**
- [ ] Single chapter upload works
- [ ] Bulk parser parses URLs correctly
- [ ] Multiple chapters upload in sequence
- [ ] Progress indicator updates
- [ ] Error handling per chapter works

---

## Troubleshooting

### Ads tidak muncul
- Cek ad status = active
- Cek ad position sesuai
- Clear browser cache
- Lihat browser console untuk errors

### Gestures tidak bekerja
- Pastikan di device yang support touch
- Enable gestures di user preferences
- Tidak ada JavaScript errors di console

### Bulk upload gagal
- Cek semua URLs valid dan accessible
- Pastikan chapter number unique
- Cek database connection
- Reduce batch size jika timeout

### Reading mode tidak save
- Clear localStorage
- Cek browser permissions
- Verify ReadingModeContext loaded

---

## Performance

### Optimizations Applied:
- Image lazy loading
- Progressive image loading (prioritize first 2 pages)
- Preload next 3 images
- Efficient gesture detection (debounced)
- Ad rotation caching
- Chapter view tracking (fire-and-forget)

### Recommended Settings:
- Images: WebP format, 800-1200px width
- Ads: Lazy load, async scripts
- Bulk upload: Max 50 chapters per batch

---

## Future Enhancements

Potential improvements:
1. A/B testing untuk ad positions
2. User heatmap untuk optimal ad placement
3. Advanced gesture customization
4. Bulk upload dari ZIP file
5. OCR untuk auto-detect page numbers
6. Analytics dashboard untuk reading patterns

---

## Support

Untuk issues atau questions:
- Buat issue di GitHub repository
- Cek browser console untuk error messages
- Verify semua dependencies installed: `npm install`
