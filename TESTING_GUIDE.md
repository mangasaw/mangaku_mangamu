# Quick Start - Testing Fitur Baru

## 🚀 Langkah-langkah Testing Cepat

### Step 1: Pastikan Dependencies Terinstall
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Jalankan Development Server
```bash
npm run dev
```

### Step 4: Testing Setiap Fitur

---

## 1️⃣ Test Ad Optimization (5 menit)

### Akses Admin Panel
```
URL: http://localhost:3000/admin/ads
```

### Test Flow:
1. ✅ Klik "Tambah Iklan Baru"
2. ✅ Isi form:
   - Nama: "Test Banner Header"
   - Posisi: Header
   - Kode: Paste contoh kode HTML (ada di halaman)
   - Aktifkan: Centang
3. ✅ Klik "Simpan Iklan"
4. ✅ Verifikasi muncul di list
5. ✅ Buka chapter reader → iklan muncul di header
6. ✅ Toggle status aktif/nonaktif → iklan hilang/muncul
7. ✅ Test filter posisi dan status

### Expected Result:
- Dashboard menampilkan statistik
- Iklan tersimpan di database
- Iklan muncul di posisi yang benar
- Toggle works tanpa reload

---

## 2️⃣ Test Reading Modes (3 menit)

### Akses Chapter Reader
```
URL: http://localhost:3000/manga/[id]/chapter/[chapterId]
```

### Test Flow:
1. ✅ Buka chapter apa saja
2. ✅ Klik tombol "⚙️ Settings" di header kanan
3. ✅ Coba setiap mode:
   - **Vertical**: Scroll ke bawah → halaman berganti smooth
   - **Horizontal**: Arrow right/left → halaman slide horizontal
   - **Double Page**: 2 halaman tampil bersamaan
   - **Webtoon**: Scroll tanpa gap antar halaman
4. ✅ Reload page → mode tetap tersimpan
5. ✅ Test keyboard shortcuts:
   - `←` `→` : navigasi
   - `S` : toggle settings

### Expected Result:
- Semua 4 mode berfungsi
- Smooth transitions
- Preferences saved di localStorage
- Keyboard shortcuts responsive

---

## 3️⃣ Test Gesture Controls (5 menit)

### Test di Mobile/Tablet (atau Chrome DevTools Mobile Mode)
```
1. Buka DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Pilih device (iPhone/iPad/Android)
```

### Test Flow:

#### Touch Gestures:
1. ✅ **Swipe Left** → Next page (horizontal mode)
2. ✅ **Swipe Right** → Previous page
3. ✅ **Single Tap** → Settings panel toggle
4. ✅ **Double Tap** → Zoom 1x ↔ 1.5x
5. ✅ **Pinch Out** (2 fingers spread) → Zoom in
6. ✅ **Pinch In** (2 fingers together) → Zoom out

#### Desktop Gestures:
1. ✅ **Click** → Tap equivalent
2. ✅ **Double Click** → Zoom toggle
3. ✅ **Ctrl + Wheel Up** → Zoom in
4. ✅ **Ctrl + Wheel Down** → Zoom out

### Expected Result:
- Gestures responsive tanpa lag
- Zoom range: 0.5x - 3x
- Tidak conflict dengan browser scroll
- Smooth animations

---

## 4️⃣ Test Bulk Upload (7 menit)

### Akses Bulk Upload
```
URL: http://localhost:3000/admin/chapters/bulk
```

### Test Flow:

#### Preparation:
Siapkan test URLs (gunakan dummy URLs atau real):
```
https://i.imgur.com/test1.jpg
https://i.imgur.com/test2.jpg
https://i.imgur.com/test3.jpg
```

#### Test Simple Format:
1. ✅ Pilih series dari dropdown
2. ✅ Paste URLs di "Quick Bulk Parser":
```
https://i.imgur.com/test1.jpg
https://i.imgur.com/test2.jpg
https://i.imgur.com/test3.jpg
```
3. ✅ Klik "Parse URLs"
4. ✅ Verifikasi: Chapter #1 dengan 3 images terbuat
5. ✅ Edit chapter number menjadi "1"
6. ✅ Klik "Upload 1 Chapter(s)"
7. ✅ Tunggu progress bar → Success!

#### Test Advanced Format (Multiple Chapters):
1. ✅ Clear form
2. ✅ Paste format advanced:
```
1|https://i.imgur.com/ch1-p1.jpg
1|https://i.imgur.com/ch1-p2.jpg
2|https://i.imgur.com/ch2-p1.jpg
2|https://i.imgur.com/ch2-p2.jpg
```
3. ✅ Klik "Parse URLs"
4. ✅ Verifikasi: 2 chapters terbuat (Chapter 1 & 2)
5. ✅ Klik "Upload 2 Chapter(s)"
6. ✅ Progress bar update per chapter
7. ✅ Success message shows: "✅ Berhasil: 2"

#### Test Error Handling:
1. ✅ Coba upload chapter dengan nomor yang sudah ada
2. ✅ Verifikasi error message muncul
3. ✅ Chapters lain tetap terupload

### Expected Result:
- Bulk parser works untuk kedua format
- Progress indicator real-time
- Multiple chapters upload sequentially
- Duplicate detection works
- Error handling per-chapter

---

## 🔍 Verification Checklist

### Database Verification:
```bash
# Cek ads tersimpan
npx prisma studio
# Buka table: Ad

# Cek chapters tersimpan
# Buka table: Chapter
```

### Browser Console:
```
F12 → Console tab
# Tidak boleh ada error merah
# Warning kuning acceptable
```

### Network Tab:
```
F12 → Network tab
# API calls harus status 200/201
# Tidak ada 404/500 errors
```

---

## ⚠️ Common Issues & Quick Fix

### Issue 1: Prisma Client Error
```bash
# Fix:
npx prisma generate
```

### Issue 2: "Module not found" Error
```bash
# Fix:
npm install
```

### Issue 3: Port 3000 already in use
```bash
# Fix:
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# atau gunakan port lain:
npm run dev -- -p 3001
```

### Issue 4: Gestures tidak bekerja
```
# Fix:
- Pastikan menggunakan touch device atau Chrome DevTools mobile mode
- Refresh page dengan Ctrl+Shift+R (hard refresh)
```

### Issue 5: Ads tidak muncul
```
# Fix:
- Pastikan ad status = Active
- Clear browser cache
- Cek ad position sesuai dengan yang dipilih
```

### Issue 6: Reading mode tidak save
```
# Fix:
- Clear localStorage: F12 → Application → Local Storage → Clear
- Refresh page
- Test lagi
```

---

## 📊 Performance Check

### Expected Load Times:
- Chapter reader: < 2 seconds
- Admin dashboard: < 1 second
- Bulk upload (10 chapters): ~5-10 seconds
- Gesture response: < 100ms

### Browser Compatibility:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## ✅ Final Checklist

Setelah testing semua fitur, pastikan:

- [ ] Ad Optimization: Dashboard works, ads show correctly
- [ ] Reading Modes: All 4 modes functional, preferences save
- [ ] Gesture Controls: Touch & desktop gestures responsive
- [ ] Bulk Upload: Can upload multiple chapters, progress shows

- [ ] No console errors
- [ ] No 404/500 network errors
- [ ] Performance acceptable
- [ ] Mobile responsive

---

## 🎉 Success Criteria

Jika semua checklist ✅, maka implementasi **SUKSES**!

Total testing time: ~20 menit
Total features: 4 major features
Total new endpoints: 6 API routes

---

## 📞 Next Actions

Setelah testing lokal sukses:

1. **Commit changes:**
```bash
git add .
git commit -m "feat: add ad optimization, reading modes, gestures, bulk upload"
```

2. **Push to repository:**
```bash
git push origin main
```

3. **Deploy to production:**
- Vercel: Auto-deploy dari GitHub
- Railway: Push ke railway branch
- VPS: Build dan restart PM2

4. **Monitor production:**
- Cek error logs
- Monitor ad impressions
- Track user preferences

---

**🚀 Happy Testing!**
