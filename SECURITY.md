# Security Improvements - Popup & Ads System

## ✅ Perbaikan Keamanan yang Telah Diterapkan

### 1. **Autentikasi & Otorisasi**
- ✅ Semua API endpoint popup, ads, dan upload kini memerlukan autentikasi admin
- ✅ Middleware diperluas untuk melindungi `/api/popup/*`, `/api/ads/*`, `/api/upload/*`
- ✅ Fungsi helper `requireAdmin()` untuk validasi konsisten di semua endpoint

**File yang diupdate:**
- `src/lib/auth.ts` (NEW) - Helper function untuk auth
- `src/middleware.ts` - Extended matcher untuk API baru
- `src/app/api/popup/route.ts`
- `src/app/api/popup/[id]/route.ts`
- `src/app/api/ads/route.ts`
- `src/app/api/ads/[id]/route.ts`
- `src/app/api/upload/route.ts`

### 2. **Input Validation**
Validasi ketat untuk semua input:

**Popup:**
- `mediaUrl`: Max 500 karakter, required
- `mediaType`: Hanya IMAGE, GIF, VIDEO
- `title`: Max 200 karakter
- `linkUrl`: Max 500 karakter
- `displayDuration`: 0-300 detik
- `showInterval`: >= 0 atau null

**Ads:**
- `name`: Max 100 karakter, required
- `code`: Max 10000 karakter, required
- `position`: Enum validation (HEADER, SIDEBAR_LEFT, etc)

### 3. **File Upload Security**

**Ukuran File:**
- Max 10MB per file
- Validasi di server-side

**Validasi Tipe File:**
- MIME type validation
- Extension whitelist: jpg, jpeg, png, gif, webp, mp4, webm
- Magic bytes validation untuk image files (cek header file)

**Nama File:**
- User input TIDAK digunakan sama sekali
- Generate nama file dengan: timestamp + random string + validated extension
- Format: `1725425810123-abc123def45.webp`

**Path Traversal Protection:**
- Nama file di-generate, tidak dari user input
- Tidak ada `../` atau path manipulation

**Magic Bytes Validation:**
- JPG/JPEG: `0xFF 0xD8`
- PNG: `0x89 0x50 0x4E 0x47`
- GIF: `0x47 0x49 0x46`
- WEBP: Check "WEBP" string at offset 8

### 4. **XSS Prevention**
- Input validation untuk URL dan text fields
- Length limits untuk mencegah buffer overflow
- Ad code disimpan as-is tapi dengan length limit 10KB

### 5. **Git Security**
- `.gitignore` updated untuk exclude `public/uploads/**`
- Uploaded files tidak masuk ke repository
- `.gitkeep` untuk maintain struktur folder

## ⚠️ Rekomendasi Tambahan (Belum Diimplementasi)

### 1. **Rate Limiting**
Tambahkan rate limiting untuk mencegah abuse:
```typescript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit'

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // max 10 upload per 15 menit
})
```

### 2. **Content Security Policy (CSP)**
Tambahkan CSP headers di `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

### 3. **Image Processing & Optimization**
Install sharp untuk:
- Resize images otomatis
- Strip metadata (EXIF data bisa contain privacy info)
- Re-encode untuk remove malicious payloads

```bash
npm install sharp
```

### 4. **Virus Scanning**
Untuk production, pertimbangkan:
- ClamAV integration
- Cloud-based scanning (AWS S3 + Lambda, Cloudflare R2)

### 5. **Database Security**
- ✅ Prisma sudah menggunakan parameterized queries (SQL injection safe)
- Consider: Database encryption at rest
- Consider: Backup & recovery plan

### 6. **Monitoring & Logging**
- Log semua upload attempts dengan IP, user, filename
- Monitor suspicious patterns
- Alert untuk failed auth attempts

### 7. **HTTPS Only**
Pastikan production menggunakan HTTPS untuk:
- Protect credentials in transit
- Protect session tokens
- Protect uploaded content

### 8. **Environment Variables**
Pastikan `.env` memiliki:
```env
NEXTAUTH_SECRET=<strong-random-secret>
DATABASE_URL=<connection-string>
NEXTAUTH_URL=https://yourdomain.com
```

## 📊 Security Checklist

| Item | Status | Priority |
|------|--------|----------|
| Authentication on admin APIs | ✅ | Critical |
| Input validation | ✅ | Critical |
| File size limits | ✅ | High |
| File type validation (MIME) | ✅ | High |
| File type validation (Magic bytes) | ✅ | High |
| Secure filename generation | ✅ | High |
| Path traversal protection | ✅ | Critical |
| XSS prevention | ✅ | High |
| Git ignore uploads | ✅ | Medium |
| Rate limiting | ❌ | High |
| CSP headers | ❌ | Medium |
| Image processing | ❌ | Medium |
| Virus scanning | ❌ | Low |
| HTTPS enforcement | ❌ | Critical |
| Monitoring/Logging | ❌ | Medium |

## 🚀 Testing Security

### Test Authentication:
```bash
# Should return 401 Unauthorized
curl -X POST http://localhost:3000/api/popup \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'
```

### Test File Upload Size:
```bash
# Upload file > 10MB, should reject
```

### Test File Type:
```bash
# Try upload .exe file, should reject
# Try upload with fake extension (.exe renamed to .jpg), should reject via magic bytes
```

## 📝 Notes

- Semua API routes sekarang memerlukan session admin yang valid
- Upload hanya bisa dilakukan oleh admin
- File validation dilakukan di multiple layers
- Middleware melindungi semua admin routes

Implementasi ini mengikuti OWASP security best practices untuk file upload dan API security.
