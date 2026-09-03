// lib/db/indexeddb.ts - IndexedDB utility for offline storage
const DB_NAME = 'offline_reader'
const DB_VERSION = 1

export interface ChapterMeta {
  chapterId: string
  seriesId: string
  seriesTitle: string
  chapterNumber: number
  downloadedAt: string
  sizeBytes: number
  pageCount: number
  status: 'complete' | 'partial' | 'revoked'
}

export interface ChapterImage {
  chapterId: string
  pageIndex: number
  blob: Blob
  width: number
  height: number
}

export interface ReadingProgressOffline {
  chapterId: string
  lastPage: number
  scrollPosition: number
  updatedAt: string
  synced: boolean
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Store untuk metadata chapter
      if (!db.objectStoreNames.contains('chapters_meta')) {
        db.createObjectStore('chapters_meta', { keyPath: 'chapterId' })
      }

      // Store untuk gambar chapter
      if (!db.objectStoreNames.contains('chapter_images')) {
        const imageStore = db.createObjectStore('chapter_images', {
          keyPath: ['chapterId', 'pageIndex'],
        })
        imageStore.createIndex('chapterId', 'chapterId', { unique: false })
      }

      // Store untuk reading progress offline
      if (!db.objectStoreNames.contains('reading_progress_offline')) {
        const progressStore = db.createObjectStore('reading_progress_offline', {
          keyPath: 'chapterId',
        })
        progressStore.createIndex('synced', 'synced', { unique: false })
      }
    }
  })
}

export async function saveChapterMeta(meta: ChapterMeta): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chapters_meta'], 'readwrite')
    const store = transaction.objectStore('chapters_meta')
    const request = store.put(meta)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function saveChapterImage(image: ChapterImage): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chapter_images'], 'readwrite')
    const store = transaction.objectStore('chapter_images')
    const request = store.put(image)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getChapterImages(chapterId: string): Promise<ChapterImage[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chapter_images'], 'readonly')
    const store = transaction.objectStore('chapter_images')
    const index = store.index('chapterId')
    const request = index.getAll(chapterId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function saveReadingProgress(progress: ReadingProgressOffline): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['reading_progress_offline'], 'readwrite')
    const store = transaction.objectStore('reading_progress_offline')
    const request = store.put(progress)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getUnsyncedProgress(): Promise<ReadingProgressOffline[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['reading_progress_offline'], 'readonly')
    const store = transaction.objectStore('reading_progress_offline')
    const index = store.index('synced')
    const request = index.getAll(false)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deleteChapter(chapterId: string): Promise<void> {
  const db = await openDB()
  
  // Delete metadata
  const metaTransaction = db.transaction(['chapters_meta'], 'readwrite')
  const metaStore = metaTransaction.objectStore('chapters_meta')
  await new Promise<void>((resolve, reject) => {
    const request = metaStore.delete(chapterId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })

  // Delete all images
  const imageTransaction = db.transaction(['chapter_images'], 'readwrite')
  const imageStore = imageTransaction.objectStore('chapter_images')
  const index = imageStore.index('chapterId')
  
  return new Promise((resolve, reject) => {
    const request = index.openCursor(chapterId)
    request.onerror = () => reject(request.error)
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
  })
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    }
  }
  return { usage: 0, quota: 0 }
}
