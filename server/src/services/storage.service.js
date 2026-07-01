// server/src/services/storage.service.js

/**
 * Storage Service – abstracts file upload handling.
 * Supports:
 *   - Local filesystem (development) – files stored under `uploads/applications/`
 *   - Cloud S3‑compatible storage (production) – uses AWS SDK.
 *
 * Configuration is driven by the environment variable `STORAGE_TYPE`:
 *   - 'local'  – use local disk storage (default)
 *   - 's3'     – use AWS S3 (or compatible) bucket.
 *
 * Required env vars for S3:
 *   - STORAGE_TYPE='s3'
 *   - S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET_NAME
 *
 * The `uploadFile` function accepts a Multer `file` object and returns a
 * normalized metadata object containing the public URL, key (bucket object key),
 * original name, MIME type and size.
 */

const path = require('path');
const fs = require('fs');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';

let s3Client = null;
if (STORAGE_TYPE === 's3') {
  // Lazy‑load AWS SDK only when needed to avoid unnecessary dependency errors.
  const AWS = require('aws-sdk');
  s3Client = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
  });
  // Ensure required env vars are present – otherwise throw early.
  const required = ['S3_BUCKET_NAME'];
  required.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required env var ${varName} for S3 storage`);
    }
  });
}

/**
 * Upload a file and return normalized metadata.
 * @param {Object} file – Multer file object.
 * @returns {Promise<Object>} metadata { url, key, originalName, mimeType, size }
 */
async function uploadFile(file) {
  if (!file) {
    throw new Error('File is required for upload');
  }

  const { originalname, mimetype, size, path: filePath, filename } = file;

  if (STORAGE_TYPE === 'local') {
    // Ensure the uploads directory exists.
    const uploadDir = path.resolve(__dirname, '../../uploads/applications');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // Sanitize original filename to prevent path traversal and unsafe characters
    const sanitizedOriginal = path.basename(originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const hash = crypto.createHash('sha256').update(Date.now() + sanitizedOriginal).digest('hex').slice(0, 8);
    const uniqueFileName = `${hash}_${sanitizedOriginal}`;
    const destPath = path.join(uploadDir, uniqueFileName);
    // Move file from temp location to our uploads directory
    fs.renameSync(filePath, destPath);
    const url = `/uploads/applications/${uniqueFileName}`; // served statically by Express
    return {
      url,
      key: uniqueFileName,
      originalName: originalname,
      mimeType: mimetype,
      size,
    };
  }

  // ----- S3 storage -----
  const bucketName = process.env.S3_BUCKET_NAME;
  const fileKey = `applications/${Date.now()}_${filename}`;
  const fileStream = fs.createReadStream(filePath);

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: fileStream,
    ContentType: mimetype,
  };

  await s3Client.upload(params).promise();
  // Construct a URL – assumes the bucket is public or uses signed URLs elsewhere.
  const url = `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;

  // Optionally delete local temp file.
  fs.unlinkSync(filePath);

  return {
    url,
    key: fileKey,
    originalName: originalname,
    mimeType: mimetype,
    size,
  };
}

/**
 * Retrieve a file URL from a stored key.
 * For local storage the key is the filename.
 * For S3 it returns the public URL.
 */
function getFileUrl(key) {
  if (STORAGE_TYPE === 'local') {
    return `/uploads/applications/${key}`;
  }
  const bucketName = process.env.S3_BUCKET_NAME;
  return `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  uploadFile,
  getFileUrl,
  // Return absolute path to a stored file when using local storage
  getLocalFilePath: (key) => {
    // Only works for local storage; for S3 callers should use signed URLs instead
    if (process.env.STORAGE_TYPE && process.env.STORAGE_TYPE !== 'local') {
      throw new Error('getLocalFilePath is only valid for local storage');
    }
    const uploadDir = path.resolve(__dirname, '../../uploads/applications');
    return path.join(uploadDir, key);
  },
  uploadFile,
  getFileUrl,
};
