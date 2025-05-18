const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// GET /list - Trả về danh sách người dùng (trở thành /api/user/list)
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}).select("_id first_name last_name");
    response.status(200).json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    response.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});

// GET /:id - Trả về thông tin chi tiết của người dùng (trở thành /api/user/:id)
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Định dạng ID người dùng không hợp lệ" });
    }
    
    const user = await User.findById(userId).select("_id first_name last_name location description occupation");
    
    if (!user) {
      return response.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    
    response.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    response.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;