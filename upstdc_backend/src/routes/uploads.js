const express = require('express');
const upload = require('../middleware/uploads');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /api/uploads:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Created }
 */
router.post('/', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'File not uploaded' });
  const path = `/${req.file.path.replace(/\\/g, '/')}`;
  return res.status(201).json({
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path,
  });
});

module.exports = router;
