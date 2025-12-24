import { PutObjectCommand } from '@aws-sdk/client-s3'
import s3 from '../config/minio.js'

export const uploadLocalController = (req, res) => {
  res.json({ message: 'Upload local ok', file: req.file })
}

export const uploadNuvemController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' })
  }

  const command = new PutObjectCommand({
    Bucket: 'uploads',
    Key: Date.now() + '-' + req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  })

  await s3.send(command)

  res.json({ message: 'Upload nuvem ok' })
}
