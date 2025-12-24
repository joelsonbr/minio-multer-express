import multer, { memoryStorage } from 'multer'
import path from 'path'

export const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    },
  }),
})

export const uploadNuvem = multer({
  storage: memoryStorage(),
})
