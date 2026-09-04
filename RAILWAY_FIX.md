# 🐛 RAILWAY DEPLOYMENT - TAMPILAN ANCUR FIX

## Masalah yang Ditemukan

Website di Railway tampilan "ancur" karena kemungkinan:
1. ❌ CSS tidak ter-load dengan benar
2. ❌ Environment variables belum di-set
3. ❌ Database connection issue di production

## ✅ Solusi Lengkap

### 1. Set Environment Variables di Railway

**Buka Railway Dashboard → Your Project → Variables**

Tambahkan environment variables berikut:

```env
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://mangakumangamu-production.up.railway.app
NEXTAUTH_SECRET=generate-random-secret-here

# Node Environment
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
# Di terminal local
openssl rand -base64 32
```

Copy hasil dan paste ke Railway Variables

---

### 2. Verify Build Process di Railway

Railway seharusnya otomatis detect Next.js. Tapi verify:

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

**Install Command:**
```
npm install
```

---

### 3. Jalankan Database Migration di Railway

**Option A: Via Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run npx prisma migrate deploy
```

**Option B: Via Railway Dashboard**
1. Settings → Deploy Triggers
2. Add build command: `npx prisma migrate deploy && npm run build`

---

### 4. Re-deploy ke Railway

**Option A: Push dari Local**
```bash
git add .
git commit -m "fix: railway deployment configuration"
git push origin main
```

Railway akan auto-deploy.

**Option B: Manual Redeploy**
1. Railway Dashboard → Deployments
2. Klik "Redeploy" pada latest deployment

---

### 5. Cek Logs untuk Debug

**Railway Dashboard → Deployments → View Logs**

Cari error seperti:
- ❌ `CSS not found`
- ❌ `Database connection failed`
- ❌ `Environment variable missing`

---

## 🔍 Diagnosis Cepat

### Test 1: CSS Loading
```bash
curl -I https://mangakumangamu-production.up.railway.app/_next/static/css/ba601090f1bf9439.css
```

Jika **404** → CSS tidak ter-generate, rebuild needed
Jika **200** → CSS ada, masalah lain

### Test 2: Database Connection
```bash
# Di Railway Shell atau local dengan production DATABASE_URL
npx prisma db push
```

Jika error → Database connection issue

### Test 3: Build Output
Cek Railway logs saat build:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
```

Jika ada error di sini → Fix error dulu

---

## 🚀 Quick Fix (Most Likely Solution)

Masalah paling umum adalah **DATABASE_URL belum di-set**.

### Langkah Cepat:

1. **Railway Dashboard → Add PostgreSQL**
   - New → Database → PostgreSQL
   - Railway akan auto-generate DATABASE_URL

2. **Verify Variables**
   - Variables tab
   - Pastikan `DATABASE_URL` ada (auto-created)
   - Tambahkan `NEXTAUTH_URL` dan `NEXTAUTH_SECRET`

3. **Redeploy**
   - Deployments → Latest → Redeploy
   - Tunggu ~2-3 menit

4. **Run Migration**
   ```bash
   railway link
   railway run npx prisma migrate deploy
   ```

5. **Test Website**
   - Buka: https://mangakumangamu-production.up.railway.app
   - Refresh dengan Ctrl+Shift+R (hard refresh)

---

## 📊 Checklist Deployment

```
□ Railway PostgreSQL database added
□ DATABASE_URL set in Variables
□ NEXTAUTH_URL set in Variables
□ NEXTAUTH_SECRET set in Variables
□ Build successful (check logs)
□ Migration deployed
□ Website loads correctly
□ CSS styles applied
□ No console errors
```

---

## 🐛 Troubleshooting Umum

### Issue: CSS Tidak Load
**Penyebab:** Tailwind tidak generate styles di build
**Fix:**
```bash
# Rebuild
npm run build
git push
```

### Issue: Database Error
**Penyebab:** DATABASE_URL salah atau database belum migrate
**Fix:**
```bash
railway run npx prisma migrate deploy
```

### Issue: 500 Internal Error
**Penyebab:** Environment variables missing
**Fix:**
- Check semua ENV vars di Railway
- Restart deployment

### Issue: Blank Page
**Penyebab:** JavaScript error atau CSP issue
**Fix:**
- Buka DevTools Console
- Lihat error message
- Fix based on error

---

## 🎯 Expected Result

Setelah fix, website seharusnya:
- ✅ Tampilan rapi dengan Tailwind CSS
- ✅ Navbar dan UI elements styled
- ✅ Dark mode toggle works
- ✅ Responsive di mobile
- ✅ No console errors

---

## 📞 Jika Masih Bermasalah

1. **Screenshot Error:**
   - Browser DevTools → Console tab
   - Network tab (filter: CSS)
   - Screenshot dan kasih tau saya

2. **Railway Logs:**
   - Copy paste build logs
   - Copy paste runtime logs

3. **Database Status:**
   ```bash
   railway run npx prisma db push --skip-generate
   ```

4. **Alternative Fix:**
   - Delete deployment
   - Redeploy dari scratch
   - Ensure all ENV vars set BEFORE deploy

---

## 💡 Tips

- Railway auto-detects Next.js, jangan override build command
- Always set ENV vars BEFORE first deploy
- Use Railway PostgreSQL (one-click setup)
- Check logs EVERY deployment
- Test di local production build dulu:
  ```bash
  npm run build
  npm start
  ```

---

**Status:** Masalah kemungkinan besar karena ENV variables belum di-set

**Action:** Set DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET → Redeploy

**ETA:** ~5 menit untuk fix
