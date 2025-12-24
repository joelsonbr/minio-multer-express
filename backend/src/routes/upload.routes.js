import { Router } from "express";
import { uploadLocal, uploadNuvem } from '../middlewares/upload.js'
import { uploadLocalController, uploadNuvemController, listarArquivosNuvem,  listarArquivosLocal } from '../controllers/upload.controller.js'

const router = Router()

router.post('/upload-local', uploadLocal.single('file'), uploadLocalController)
router.post('/upload-nuvem', uploadNuvem.single('file'), uploadNuvemController)
router.get('/upload-local', listarArquivosLocal)
router.get('/upload-nuvem', listarArquivosNuvem)

export default router