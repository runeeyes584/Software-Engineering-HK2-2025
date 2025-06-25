const Tour = require('../models/Tour');
const Category = require('../models/Category');

/**
 * Hàm lấy gợi ý tìm kiếm cho tours, destinations và categories
 */
/**
 * Hàm lấy gợi ý tìm kiếm cho tours chỉ dựa vào tiêu đề và mô tả,
 * không tìm theo tags hay các trường khác.
 * Chỉ các destinations và categories vẫn được lấy bình thường.
 */
exports.getSearchSuggestions = async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query || query.length < 2) {
      return res.status(200).json({
        tours: [],
        destinations: [],
        categories: []
      });
    }

    // Tạo regex pattern để tìm kiếm (case-insensitive)
    const searchRegex = new RegExp(query, 'i');
    
    // Tìm tours phù hợp với từ khóa (tối đa 5 kết quả) - chỉ tìm theo name và description
    const tours = await Tour.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
        // Loại bỏ tìm kiếm theo destination hoặc các trường khác
      ]
    })
    .select('name description images price destination averageRating duration')
    .limit(5)
    .lean();

    // Lấy các điểm đến phù hợp
    const uniqueDestinations = await Tour.aggregate([
      { $match: { destination: searchRegex } },
      { $group: { _id: "$destination" } },
      { $limit: 5 }
    ]);
    const destinations = uniqueDestinations.map(dest => dest._id);
    
    // Lấy categories phù hợp
    const categories = await Category.find({ name: searchRegex })
      .select('name')
      .limit(5)
      .lean();
    
    // Trả về kết quả
    res.status(200).json({
      tours,
      destinations,
      categories
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy gợi ý tìm kiếm" });
  }
};

/**
 * Tìm kiếm tour nâng cao với các bộ lọc
 * Từ khóa tìm kiếm chỉ được áp dụng cho tiêu đề và mô tả,
 * không tìm theo tags hay các trường khác.
 */
exports.searchTours = async (req, res) => {
  try {
    const { 
      query, // từ khóa tìm kiếm
      destination, // địa điểm
      category, // danh mục
      minPrice, 
      maxPrice,
      minDuration,
      maxDuration,
      sortBy // sắp xếp theo: 'price-asc', 'price-desc', 'rating', 'duration'
    } = req.query;
    
    // Xây dựng query MongoDB
    const filter = {};
    
    // Tìm theo từ khóa (chỉ trong tên và mô tả, không tìm theo destination hay các trường khác)
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex }
        // Loại bỏ tìm kiếm theo destination
      ];
    }
    
    // Lọc theo điểm đến
    if (destination) {
      filter.destination = new RegExp(destination, 'i');
    }
    
    // Lọc theo danh mục
    if (category) {
      filter.category = category;
    }
    
    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Lọc theo thời gian tour
    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = Number(minDuration);
      if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }
    
    // Xây dựng sort options
    let sortOptions = { createdAt: -1 }; // mặc định sort theo mới nhất
    
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { averageRating: -1 };
          break;
        case 'duration':
          sortOptions = { duration: 1 };
          break;
      }
    }
    
    // Thực hiện query với pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const tours = await Tour.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Đếm tổng số tour thỏa mãn điều kiện
    const totalCount = await Tour.countDocuments(filter);
    
    res.status(200).json({
      tours,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Search tours error:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm tour" });
  }
};
