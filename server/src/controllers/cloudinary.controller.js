// controllers/cloudinary.controller.js
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file để upload' });
    }

    const results = [];
    // Sử dụng vòng lặp for...of để xử lý tuần tự, đảm bảo thứ tự
    for (const file of req.files) {
      const options = {
        folder: file.mimetype.startsWith('image/') ? 'images' : 'videos',
        resource_type: file.mimetype.startsWith('image/') ? 'image' : 'video'
      };

      if (file.mimetype.startsWith('video/')) {
        options.chunk_size = 10000000;
        options.eager = [{ format: "mp4", quality: "auto" }];
      }

      // Đợi cho đến khi file hiện tại upload xong
      const result = await cloudinary.uploader.upload(file.path, options);
      results.push(result);

      // Xóa file tạm ngay sau khi upload xong
      fs.unlinkSync(file.path);
    }

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
    // Cố gắng dọn dẹp các file tạm còn lại nếu có lỗi
    req.files.forEach(file => {
      if(fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    res.status(500).json({  message: error.message || 'Lỗi khi upload nhiều file' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const publicId = req.params[0]; // vì dùng route wildcard '*'

    console.log("publicId cần xoá:", publicId);

    // Tự động xác định resource_type từ folder
    let resourceType = 'image'; 
    if (publicId.startsWith('videos/')) resourceType = 'video';

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    res.json({
      success: true,
      message: 'Xoá file thành công',
      result
    });
  } catch (error) {
    console.error('Lỗi xóa file:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi xoá file' });
  }
};



module.exports = {
  uploadMultipleFiles,
  deleteFile
};
