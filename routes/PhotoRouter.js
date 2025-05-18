const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// GET /photosOfUser/:id - Trả về ảnh của người dùng (trở thành /api/photo/photosOfUser/:id)
router.get("/photosOfUser/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Định dạng ID người dùng không hợp lệ" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const photos = await Photo.find({ user_id: userId })
      .populate({
        path: "comments.user_id",
        select: "_id first_name last_name"
      });

    const formattedPhotos = photos.map(photo => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: photo.comments.map(comment => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: comment.user_id ? {
          _id: comment.user_id._id,
          first_name: comment.user_id.first_name,
          last_name: comment.user_id.last_name
        } : null
      }))
    }));

    response.status(200).json(formattedPhotos);
  } catch (error) {
    console.error("Lỗi khi lấy ảnh của người dùng:", error);
    response.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;