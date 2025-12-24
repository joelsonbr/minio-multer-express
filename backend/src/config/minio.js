import { S3Client } from '@aws-sdk/client-s3'
import 'dotenv/config'

const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
        accessKeyId: process.env.MINIO_KEY,
        secretAccessKey: process.env.MINIO_SECRET,
    },
    forcePathStyle: true
})

export default s3