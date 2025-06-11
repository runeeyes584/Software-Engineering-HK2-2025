const express = require('express');
const multer = require('multer');
const {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile
} = require('../controllers/cloudinary.controller.js');

const router = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Không hỗ trợ định dạng file này!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
    files: 20
  }
});

// Route upload nhiều file
router.post('/upload-multiple', upload.array('files', 20), uploadMultipleFiles);

// Route xóa file
router.delete('/delete/*', deleteFile);

module.exports = router;
