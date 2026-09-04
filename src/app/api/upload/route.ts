import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { requireAdmin } from '@/lib/auth'
import { NextRequest } from 'next/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm']

export async function POST(req: NextRequest) {
  // Check authentication
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB allowed.' }, { status: 400 })
    }

    // Validate file type by MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and videos allowed.' }, { status: 400 })
    }

    // Validate file extension
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 })
    }

    // Generate secure filename (no user input)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const filename = `${timestamp}-${randomStr}.${ext}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'popups')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Additional validation: Check file magic bytes for images
    if (file.type.startsWith('image/')) {
      const isValidImage = validateImageMagicBytes(buffer, ext)
      if (!isValidImage) {
        return NextResponse.json({ error: 'File content does not match extension' }, { status: 400 })
      }
    }

    // Save file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/popups/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// Validate file by checking magic bytes
function validateImageMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false

  const magicBytes = buffer.slice(0, 4)
  
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return magicBytes[0] === 0xFF && magicBytes[1] === 0xD8
    case 'png':
      return magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47
    case 'gif':
      return magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46
    case 'webp':
      return buffer.slice(8, 12).toString() === 'WEBP'
    default:
      return true // Skip validation for video files
  }
}
