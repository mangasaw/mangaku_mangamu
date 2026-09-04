# Image Optimization Guide

## 🚀 Optimasi Loading Gambar Manga

### ✅ Fitur yang Telah Diterapkan:

#### **1. Next.js Image Component** 
- Menggunakan `next/image` untuk automatic image optimization
- Format otomatis: AVIF → WebP → fallback
- Lazy loading built-in
- Blur placeholder untuk UX lebih baik
- Cache 7 hari untuk performa maksimal

#### **2. Lazy Loading dengan Intersection Observer**
- Gambar hanya di-load saat hampir terlihat (200px sebelum viewport)
- Hemat bandwidth & memory
- Smooth loading experience
- Component `LazyLoad` reusable

#### **3. Progressive Image Loading**
- Priority loading untuk gambar pertama (above the fold)
- First 2 pages chapter di-load langsung
- First 6 covers di browse page di-load priority
- Sisanya lazy load

#### **4. Image Preloading**
- Preload 3 gambar berikutnya saat user scroll
- Hook `useImagePreloader` untuk smart preloading
- Indicator preloading di UI

#### **5. Responsive Images**
- Multiple sizes untuk device berbeda
- Sizes attribute untuk optimal image selection
- Cover: `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw`
- Chapter page: `(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px`

#### **6. Error Handling**
- Graceful fallback jika gambar gagal load
- Skeleton loading state
- Error placeholder dengan icon

#### **7. Compression & Format**
- AVIF format (70% lebih kecil dari JPEG)
- WebP fallback (30% lebih kecil)
- Quality: 75 untuk cover, 80 untuk chapter pages
- Automatic format detection

#### **8. Build Optimizations**
- SWC minification (lebih cepat dari Terser)
- Response compression
- Remove console.log di production
- Image cache 7 hari

## 📊 Perbandingan Performa

### **Before (Tanpa Optimasi):**
- ❌ Load semua gambar sekaligus
- ❌ Full size images
- ❌ No caching
- ❌ Slow initial load
- ❌ High bandwidth usage

### **After (Dengan Optimasi):**
- ✅ Lazy load (save 60-80% bandwidth awal)
- ✅ AVIF/WebP format (save 30-70% size)
- ✅ Next.js automatic optimization
- ✅ 7 days cache (instant subsequent loads)
- ✅ Preload next 3 images (smooth scrolling)
- ✅ Priority loading (fast LCP)

## 🎯 Hasil yang Diharapkan:

### **Kecepatan Loading:**
- **Initial page load:** 50-70% lebih cepat
- **Chapter reader:** Load 2 halaman pertama instant, sisanya progresif
- **Browse page:** 6 cover pertama instant, sisanya lazy
- **Scroll experience:** Smooth, no waiting
- **Bandwidth usage:** Turun 60-80%

### **User Experience:**
- Blur placeholder → Sharp image transition
- Skeleton loading untuk feedback visual
- Error handling yang baik
- Preloading membuat scroll mulus
- Mobile-optimized sizes

## 📁 Component yang Dibuat:

1. **`OptimizedImage.tsx`**
   - `OptimizedImage` - Base component dengan loading states
   - `MangaCover` - Preset untuk manga cover
   - `MangaPage` - Preset untuk chapter pages

2. **`LazyLoad.tsx`**
   - `LazyLoad` - Intersection Observer wrapper
   - `useImagePreloader` - Hook untuk preload gambar

## 🔧 Cara Penggunaan:

### **Untuk Cover Manga:**
```tsx
import { MangaCover } from '@/components/OptimizedImage'

<MangaCover
  src={manga.coverImage}
  alt={manga.title}
  priority={index < 6} // Priority untuk 6 pertama
/>
```

### **Untuk Chapter Pages:**
```tsx
import { MangaPage } from '@/components/OptimizedImage'

<MangaPage
  src={imageUrl}
  alt={`Page ${pageNumber}`}
  pageNumber={pageNumber}
  priority={pageNumber <= 2} // Priority untuk 2 halaman pertama
/>
```

### **Untuk Lazy Loading:**
```tsx
import { LazyLoad } from '@/components/LazyLoad'

<LazyLoad rootMargin="400px">
  <YourComponent />
</LazyLoad>
```

## 🚀 Rekomendasi Tambahan:

### **1. CDN untuk Images**
Gunakan CDN seperti:
- Cloudflare Images
- AWS CloudFront
- Vercel Image Optimization
- Cloudinary

### **2. Image Processing Server**
Untuk manga yang banyak, pertimbangkan:
- Sharp server untuk resize on-the-fly
- imgproxy untuk cached transformations
- thumbor untuk image processing

### **3. Service Worker untuk Offline**
```javascript
// Cache images untuk offline reading
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  }
})
```

### **4. Progressive Web App (PWA)**
- Tambahkan manifest.json
- Service worker untuk offline support
- Cache API untuk chapter downloads

### **5. HTTP/2 & HTTP/3**
- Server push untuk critical images
- Multiplexing untuk parallel loading
- Faster connection establishment

### **6. WebP/AVIF Generation**
Jika upload JPEG/PNG, convert ke WebP/AVIF:
```bash
# Using sharp
sharp('input.jpg')
  .webp({ quality: 80 })
  .toFile('output.webp')

sharp('input.jpg')
  .avif({ quality: 70 })
  .toFile('output.avif')
```

## 📈 Monitoring

### **Core Web Vitals to Track:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **FCP (First Contentful Paint):** < 1.8s

### **Image Metrics:**
- Image load time
- Cache hit rate
- Bandwidth usage
- Format distribution (AVIF/WebP/JPEG)

## ✅ Checklist Deploy:

- [x] Next.js Image optimization configured
- [x] Lazy loading implemented
- [x] Preloading strategy
- [x] Error handling
- [x] Responsive images
- [x] Cache headers
- [ ] CDN setup (recommended)
- [ ] Image compression pipeline (recommended)
- [ ] PWA for offline (optional)
- [ ] Analytics for monitoring (recommended)

Dengan implementasi ini, website manga Anda akan **jauh lebih cepat** dan memberikan **user experience yang lebih baik**!
