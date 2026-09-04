# 🚀 NEW FEATURES IMPLEMENTATION GUIDE

## ✅ COMPLETED FEATURES

### 1. Database Schema ✅ (100%)

**Semua tabel telah dibuat:**
- ✅ Notifications (NEW_CHAPTER, SERIES_COMPLETED, COMMENT_REPLY, SYSTEM, PROMOTION)
- ✅ Comments (likes, edit, delete support)
- ✅ Ratings (1-5 stars with reviews)
- ✅ Subscriptions (FREE, BASIC, PREMIUM, VIP tiers)
- ✅ Donations (payment tracking, anonymous support)
- ✅ ReadingHistory (track reading time & completion)
- ✅ UserPreference (reading modes, gestures, theme)

**Database sudah di-push:** `npx prisma db push` ✅

### 2. API Endpoints ✅ (Partial - 30%)

**Completed APIs:**
- ✅ `/api/chapters/[chapterId]/comments` - GET/POST comments
- ✅ `/api/series/[seriesId]/rating` - GET/POST/DELETE ratings
- ✅ `/api/notifications` - GET/PUT/POST notifications

**Pending APIs:** (Need to implement)
- ❌ `/api/subscriptions` - Manage subscriptions
- ❌ `/api/donations` - Process donations
- ❌ `/api/user/preferences` - Reading settings
- ❌ `/api/admin/bulk-upload` - Bulk manga upload

---

## 📋 FEATURES TO IMPLEMENT

### A. Notifications System ⚠️ (50% Done)

**✅ Completed:**
- Database schema
- API endpoints
- Backend logic

**❌ TODO:**
```typescript
// 1. Frontend Component
src/components/NotificationBell.tsx
- Bell icon with badge count
- Dropdown notification list
- Mark as read functionality

// 2. Real-time Updates (Optional)
- WebSocket or Server-Sent Events
- Push notifications (Service Worker)

// 3. Email Notifications
- Setup email service (SendGrid/Mailgun)
- Email templates
- Notification preferences
```

**How to use:**
```typescript
// Get notifications
const res = await fetch('/api/notifications?unread=true')
const { notifications, unreadCount } = await res.json()

// Mark as read
await fetch('/api/notifications', {
  method: 'PUT',
  body: JSON.stringify({ notificationId: '...' })
})
```

---

### B. Comments & Ratings ⚠️ (50% Done)

**✅ Completed:**
- Database schema
- API endpoints (comments & ratings)
- Auto-calculate average rating

**❌ TODO:**
```typescript
// 1. Comments Component
src/components/CommentSection.tsx
- Display comments list
- Add new comment form
- Like button
- Edit/Delete own comments
- Pagination

// 2. Rating Component
src/components/RatingStars.tsx
- Star rating input
- Display average rating
- Review form
- Rating distribution chart

// 3. Add to Chapter Page
src/app/manga/[id]/chapter/[chapterId]/page.tsx
- Import CommentSection
- Place after chapter content

// 4. Add to Series Page
src/app/manga/[id]/page.tsx
- Import RatingStars
- Show rating & reviews
```

**Example Usage:**
```tsx
// In chapter page
<CommentSection chapterId={chapterId} />

// In series page
<RatingStars seriesId={seriesId} />
```

---

### C. Meta Tags (SEO) ❌ (0% Done)

**TODO:**
```typescript
// 1. Update Series Page
src/app/manga/[id]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const series = await prisma.series.findUnique({
    where: { id: params.id }
  })
  
  return {
    title: `${series.title} - Read Online`,
    description: series.description,
    openGraph: {
      title: series.title,
      description: series.description,
      images: [series.coverImage],
      type: 'book',
    },
    twitter: {
      card: 'summary_large_image',
      title: series.title,
      description: series.description,
      images: [series.coverImage],
    },
  }
}

// 2. Add Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: series.title,
  author: series.author,
  genre: 'Manga',
  image: series.coverImage,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: series.averageRating,
    ratingCount: series.totalRatings,
  },
}

// 3. Generate Sitemap
src/app/sitemap.ts
export default async function sitemap() {
  const series = await prisma.series.findMany()
  return series.map(s => ({
    url: `https://yoursite.com/manga/${s.id}`,
    lastModified: s.updatedAt,
  }))
}
```

---

### D. Ad Placement Optimization ❌ (0% Done)

**Current State:**
- Ad component exists but not optimized
- No strategic placement

**TODO:**
```typescript
// 1. Strategic Ad Positions
- Between chapters (natural break point)
- Before reading (pre-roll)
- After 5 pages (mid-content)
- After chapter end (post-roll)

// 2. Update Reader
src/app/manga/[id]/chapter/[chapterId]/page.tsx

// Add ads strategically
{chapter.images.map((img, i) => (
  <>
    <MangaPage src={img} ... />
    {i === 4 && <AdComponent position="INLINE" />}
    {i === 9 && <AdComponent position="INLINE" />}
  </>
))}

// 3. Ad Performance Tracking
- Click-through rate
- Viewability metrics
- Revenue optimization

// 4. Ad Formats
- Display ads (current)
- Native ads (blend with content)
- Video ads (optional skip after 5s)
- Interstitial ads (between chapters)
```

**Revenue Tips:**
- Google AdSense: Easy setup, lower RPM
- Media.net: Better for manga sites
- Direct advertisers: Highest revenue
- Ad network rotation: Maximize fill rate

---

### E. Premium Features ❌ (10% Done)

**✅ Completed:**
- Database schema (Subscription model)
- Tier system (FREE, BASIC, PREMIUM, VIP)

**❌ TODO:**
```typescript
// 1. Subscription API
src/app/api/subscriptions/route.ts
- Create subscription
- Cancel subscription
- Upgrade/downgrade tier
- Check subscription status

// 2. Payment Integration
- Stripe/Paddle integration
- Webhook handling
- Invoice generation
- Refund processing

// 3. Premium Features
const premiumFeatures = {
  FREE: {
    ads: true,
    downloadLimit: 0,
    readPremiumContent: false,
  },
  BASIC: {
    ads: false,
    downloadLimit: 50,
    readPremiumContent: false,
    price: '$4.99/month',
  },
  PREMIUM: {
    ads: false,
    downloadLimit: 200,
    readPremiumContent: true,
    earlyAccess: true,
    price: '$9.99/month',
  },
  VIP: {
    ads: false,
    downloadLimit: -1, // unlimited
    readPremiumContent: true,
    earlyAccess: true,
    exclusiveContent: true,
    badge: true,
    price: '$19.99/month',
  },
}

// 4. Premium Gate Component
src/components/PremiumGate.tsx
- Check user subscription
- Show upgrade prompt
- Lock premium content

// 5. Subscription Page
src/app/subscribe/page.tsx
- Pricing table
- Feature comparison
- Payment form
```

**Implementation Priority:**
1. Stripe integration (1 week)
2. Subscription API (3 days)
3. Premium gate component (2 days)
4. Pricing page (1 day)

---

### F. Donation System ❌ (10% Done)

**✅ Completed:**
- Database schema

**❌ TODO:**
```typescript
// 1. Donation API
src/app/api/donations/route.ts
- Process donation
- Webhook handling
- Thank you email

// 2. Payment Integration
- Stripe/PayPal one-time payment
- Custom amount support
- Preset amounts ($5, $10, $25, $50, $100)

// 3. Donation Widget
src/components/DonationButton.tsx
<DonationButton 
  presets={[5, 10, 25, 50, 100]}
  customAmount={true}
  message="Support the development"
/>

// 4. Donor Recognition
- Hall of fame page
- Top donors list
- Anonymous option
- Custom message/dedication

// 5. Add to Site
- Footer donation button
- Series page "Support this series"
- Profile page donation history
```

**Platforms:**
- Stripe: Best for custom amounts
- Ko-fi: Easy setup, 0% fee
- Buy Me a Coffee: Popular, good UX
- PayPal: Wide acceptance

---

### G. Reading Modes ❌ (0% Done)

**TODO:**
```typescript
// 1. Create Reading Mode Context
src/contexts/ReadingModeContext.tsx

type ReadingMode = 'vertical' | 'horizontal' | 'double-page' | 'webtoon'

const ReadingModeContext = createContext<{
  mode: ReadingMode
  setMode: (mode: ReadingMode) => void
}>()

// 2. Update Chapter Reader
src/app/manga/[id]/chapter/[chapterId]/page.tsx

// Vertical Mode (current default)
<div className="space-y-2">
  {images.map(img => <MangaPage src={img} />)}
</div>

// Horizontal Mode (swipe left/right)
<Swiper 
  direction="horizontal"
  pagination={{ clickable: true }}
>
  {images.map(img => 
    <SwiperSlide><MangaPage src={img} /></SwiperSlide>
  )}
</Swiper>

// Double Page Mode (manga style)
<div className="grid grid-cols-2 gap-2">
  {images.map((img, i) => {
    if (i % 2 === 0) {
      return (
        <>
          <MangaPage src={images[i]} />
          <MangaPage src={images[i+1]} />
        </>
      )
    }
  })}
</div>

// Webtoon Mode (infinite scroll)
<InfiniteScroll
  dataLength={images.length}
  next={loadMorePages}
  hasMore={true}
>
  {images.map(img => <MangaPage src={img} />)}
</InfiniteScroll>

// 3. Reading Mode Selector
src/components/ReadingModeSelector.tsx
- Dropdown or button group
- Save preference to UserPreference
- Icons for each mode

// 4. Install Dependencies
npm install swiper react-infinite-scroll-component
```

**User Preference:**
```typescript
// Save reading mode
await fetch('/api/user/preferences', {
  method: 'PUT',
  body: JSON.stringify({ readingMode: 'horizontal' })
})
```

---

### H. Gesture Controls ❌ (0% Done)

**TODO:**
```typescript
// 1. Install Dependencies
npm install react-use-gesture

// 2. Implement Gestures
src/components/GestureReader.tsx

import { useGesture } from 'react-use-gesture'

export function GestureReader({ children, onNext, onPrev }) {
  const bind = useGesture({
    // Swipe left/right
    onDrag: ({ direction: [xDir], distance, cancel }) => {
      if (distance > 100) {
        if (xDir > 0) onPrev() // swipe right = previous
        else onNext() // swipe left = next
        cancel()
      }
    },
    
    // Pinch to zoom
    onPinch: ({ offset: [scale], cancel }) => {
      if (scale > 2) {
        // Zoom in
      } else if (scale < 0.5) {
        // Zoom out
      }
    },
    
    // Double tap to fit
    onDoubleClick: () => {
      // Toggle fit-to-screen
    },
  })

  return <div {...bind()}>{children}</div>
}

// 3. Add to Reader
<GestureReader
  onNext={() => setCurrentPage(p => p + 1)}
  onPrev={() => setCurrentPage(p => p - 1)}
>
  <MangaPage src={currentImage} />
</GestureReader>

// 4. Gesture Settings
- Enable/disable gestures
- Customize swipe threshold
- Pinch zoom sensitivity
```

**Gestures to Support:**
- ✋ Swipe left/right: Next/previous page
- 🤏 Pinch: Zoom in/out
- 👆 Double tap: Fit to screen
- 📜 Long press: Show menu
- ☝️ Tap sides: Next/previous (like Kindle)

---

### I. Bulk Upload ❌ (0% Done)

**TODO:**
```typescript
// 1. Admin Bulk Upload Page
src/app/admin/bulk-upload/page.tsx

<BulkUploadForm>
  <FileUpload
    accept=".zip,.cbz"
    multiple={true}
    onChange={handleUpload}
  />
  
  <MetadataForm>
    <input name="seriesId" />
    <input name="startChapter" />
    <select name="imageFormat" />
  </MetadataForm>
  
  <ProcessingStatus>
    {uploads.map(u => (
      <ProgressBar 
        file={u.filename}
        progress={u.progress}
        status={u.status}
      />
    ))}
  </ProcessingStatus>
</BulkUploadForm>

// 2. Bulk Upload API
src/app/api/admin/bulk-upload/route.ts

export async function POST(req: NextRequest) {
  // 1. Extract ZIP file
  const zip = await unzip(file)
  
  // 2. Process images
  const images = await Promise.all(
    zip.files.map(async file => {
      // Resize & optimize
      const optimized = await sharp(file)
        .resize(1200)
        .webp({ quality: 80 })
        .toBuffer()
      
      // Upload to storage
      const url = await uploadToStorage(optimized)
      return url
    })
  )
  
  // 3. Create chapters
  await prisma.chapter.createMany({
    data: chapterData
  })
  
  // 4. Send notifications
  await notifySubscribers(seriesId)
}

// 3. Features
- ZIP/CBZ support
- Automatic image optimization
- Metadata extraction from filenames
- Chapter auto-numbering
- Duplicate detection
- Error handling & retry
- Progress tracking
- Batch processing (10 chapters at a time)

// 4. CSV Import
- Import series metadata from CSV
- Bulk update series info
- Import chapter list

// 5. Image Processing
npm install sharp archiver
- Auto-resize to max 1200px width
- Convert to WebP
- Generate thumbnails
- Strip metadata
```

**Workflow:**
1. Admin uploads ZIP (contains multiple chapters)
2. System extracts & validates
3. Images optimized & uploaded
4. Chapters created in database
5. Notifications sent to subscribers
6. Success report generated

---

## 🎯 IMPLEMENTATION PRIORITY

### Week 1 (Critical)
1. ✅ Comments component (3 days)
2. ✅ Rating component (2 days)
3. ✅ Meta tags (1 day)
4. ✅ Reading modes (1 day)

### Week 2 (High Priority)
1. Gesture controls (2 days)
2. Notification UI (2 days)
3. Ad optimization (1 day)
4. Bulk upload (2 days)

### Week 3 (Monetization)
1. Stripe integration (3 days)
2. Subscription system (2 days)
3. Donation system (2 days)

### Week 4 (Polish)
1. Testing all features
2. Bug fixes
3. Performance optimization
4. Documentation

---

## 📦 REQUIRED PACKAGES

```bash
# Install all dependencies
npm install \
  swiper \
  react-infinite-scroll-component \
  react-use-gesture \
  sharp \
  archiver \
  stripe \
  @stripe/stripe-js \
  react-hot-toast \
  framer-motion
```

---

## 🚀 QUICK START (Next Steps)

1. **Comments & Ratings (Start Here)**
```bash
# Create components
touch src/components/CommentSection.tsx
touch src/components/RatingStars.tsx

# Add to chapter page
# Import and use <CommentSection chapterId={id} />
```

2. **Reading Modes**
```bash
npm install swiper
# Update chapter reader with mode selector
```

3. **Gestures**
```bash
npm install react-use-gesture
# Wrap reader with gesture handler
```

4. **Bulk Upload**
```bash
npm install sharp archiver
# Create admin/bulk-upload page
```

---

## 📚 RESOURCES

- **Comments/Ratings UI:** Disqus-like design
- **Reading Modes:** MangaDex reference
- **Gestures:** Tachiyomi app patterns
- **Stripe:** https://stripe.com/docs/payments
- **SEO:** Next.js metadata docs

---

## ⚠️ IMPORTANT NOTES

1. **Database is ready** - All schemas pushed ✅
2. **APIs partially done** - Comments, Ratings, Notifications ready
3. **Frontend components needed** - UI implementation required
4. **Payment integration** - Requires Stripe account setup
5. **Testing required** - Each feature needs testing

---

Mau saya lanjutkan implementasi fitur mana dulu? Atau butuh bantuan dengan salah satu TODO di atas?
