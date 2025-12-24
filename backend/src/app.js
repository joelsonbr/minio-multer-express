import express from 'express'
import uploadRoutes from './routes/upload.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(uploadRoutes)

export default app