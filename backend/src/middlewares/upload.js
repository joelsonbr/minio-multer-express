import multer, { memoryStorage } from 'multer'
import path from 'path'

export const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const nomeLimpo = file.originalname.replace(/\s+/g, '-');
      cb(null, `${Date.now()}-${nomeLimpo}`);
    },
  }),
})

export const uploadNuvem = multer({
  storage: memoryStorage(),
})
