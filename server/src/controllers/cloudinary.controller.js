// controllers/cloudinary.controller.js
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
    }

    let result;
    if (req.file.mimetype.startsWith('image/')) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'images',
        resource_type: 'image'
      });
    } else if (req.file.mimetype.startsWith('video/')) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'videos',
        resource_type: 'video',
        chunk_size: 10000000,
        eager: [{ format: "mp4", quality: "auto" }]
      });
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video'
    });
  } catch (error) {
    console.error('Lỗi upload file:', error);
    res.status(500).json({ message: 'Lỗi khi upload file' });
  }
};

const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file để upload' });
    }

    const uploadPromises = req.files.map(file => {
      const options = {
        folder: file.mimetype.startsWith('image/') ? 'images' : 'videos',
        resource_type: file.mimetype.startsWith('image/') ? 'image' : 'video'
      };

      if (file.mimetype.startsWith('video/')) {
        options.chunk_size = 10000000;
        options.eager = [{ format: "mp4", quality: "auto" }];
      }

      return cloudinary.uploader.upload(file.path, options);
    });

    const results = await Promise.all(uploadPromises);

    req.files.forEach(file => {
      fs.unlinkSync(file.path);
    });

    res.json({
      success: true,
      files: results.map((result, index) => ({
        fileUrl: result.secure_url,
        publicId: result.public_id,
        type: req.files[index].mimetype.startsWith('image/') ? 'image' : 'video'
      }))
    });
  } catch (error) {
    console.error('Lỗi upload nhiều file:', error);
    res.status(500).json({ message: 'Lỗi khi upload nhiều file' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });
    res.json({
      success: true,
      message: 'Xóa file thành công',
      result
    });
  } catch (error) {
    console.error('Lỗi xóa file:', error);
    res.status(500).json({ message: 'Lỗi khi xóa file' });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile
};
