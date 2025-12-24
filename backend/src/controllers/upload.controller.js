import { PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import s3 from '../config/minio.js'

export const uploadLocalController = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' })
  }
  res.json({ message: 'Upload local ok', file: req.file })
}

export const uploadNuvemController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' });
  }

  // 1. Gerar o nome do arquivo que será usado na Nuvem
  const fileName = `${Date.now()}-${req.file.originalname}`;

  // 2. Calcular o tamanho em MB (arredondado para 3 casas)
  const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(3) + " MB";

  try {
    const command = new PutObjectCommand({
      Bucket: 'uploads',
      Key: fileName, // Usa a variável criada acima
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    // 3. Retornar o JSON com todos os detalhes
    res.json({
      message: "Upload nuvem ok",
      file: {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        filename: fileName,
        size: sizeInMB
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar para o MinIO' });
  }
};

export const listarArquivosNuvem = async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: 'uploads',
    })

    const response = await s3.send(command)

    if (!response.Contents) {
      return res.json({ files: [] })
    }

    //mapear o arquivo
    const listaFormatada = response.Contents.map((item) => {
      const sizeInMB = (item.Size / (1024 * 1024)).toFixed(3) + 'MB'
      const partes = item.Key.split('-')
      const originalName = partes.length > 1 ? partes.slice(1).join('-') : item.Key

      return {
        filename: item.Key,
        originalname: originalName,
        size: sizeInMB, // Ex: "0.135 MB"
        lastModified: item.LastModified,
        // Você pode montar a URL pública se o bucket for público:
        url: `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}${item.Key}`
      };
    })

    res.json({
      message: "Lista de arquivos recuperada",
      files: listaFormatada
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar arquivos do MinIO' });
  }
}

export const listarArquivosLocal = (req, res) => {
  try {
    const diretorio = 'uploads'
    const nomesDosArquivos = fs.readdirSync(diretorio)

    const listaFormatada = nomesDosArquivos.map((nome) => {
      const caminhoCompleto = path.join(diretorio, nome)

      const stats = fs.statSync(caminhoCompleto)
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(3) + 'MB'

      return {
        filename: nome,
        originalname: nome.split('-').slice(1).join('-') || nome,
        size: sizeInMB,
        url: `http://localhost:${process.env.PORT}/${process.env.LOCAL_BUCKET}/${nome}`
      }
    })

    res.json({
      message: 'Lista local ok',
      files: listaFormatada
    })
  } catch {
    res.status(500).json({ error: "Erro ao ler pasta local: " + error.message });
  }
}