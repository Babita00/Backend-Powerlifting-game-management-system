import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const MAX_SIZE_MB = 5
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const mimeToExt: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

export const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!mimeToExt[file.mimetype])
    return cb(new Error('Only JPG/PNG/WEBP images are allowed'))
  cb(null, true)
}

export const createUploader = (
  prefix: string,
  fileFilter: multer.Options['fileFilter'] = imageFileFilter
) => {
  const destDir = path.join(UPLOAD_DIR, prefix)
  ensureDir(destDir)

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destDir),
    filename: (_req, file, cb) => {
      const ext =
        mimeToExt[file.mimetype] ?? path.extname(file.originalname).toLowerCase()
      const id = crypto.randomBytes(16).toString('hex')
      cb(null, `${prefix}_${Date.now()}_${id}${ext}`)
    },
  })

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  })
}

export const uploadEventImage = createUploader('events')
