import path from 'path'
import appRootPath from 'app-root-path'

const rootDir = appRootPath.toString()

export const uploadPath = process.env.UPLOAD_DIR ?? 'uploads'
export const UPLOAD_DIR = path.join(rootDir, uploadPath)
