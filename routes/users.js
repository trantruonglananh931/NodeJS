const express = require('express');
const router = express.Router();
const User = require('../schemas/user'); 
const Role = require('../schemas/role');

router.post('/', async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;

    const user = new User({ username, password, email, fullName, avatarUrl, role });
    await user.save();

    res.status(201).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi tạo User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi tạo User.",
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { username, fullName, loginCountGte, loginCountLte } = req.query;

    let query = {};

    if (username) {
      query.username = { $regex: username, $options: 'i' };
    }

    if (fullName) {
      query.fullName = { $regex: fullName, $options: 'i' };
    }

    if (loginCountGte) {
      query.loginCount = { ...query.loginCount, $gte: parseInt(loginCountGte) };
    }

    if (loginCountLte) {
      query.loginCount = { ...query.loginCount, $lte: parseInt(loginCountLte) };
    }

    const users = await User.find(query).populate('role');

    res.status(200).send({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách User.",
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy User.",
      });
    }

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi lấy User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy User.",
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, password, email, fullName, avatarUrl, role, status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy User.",
      });
    }

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật User.",
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: false }, // Xóa mềm bằng cách đổi status thành false
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy User.",
      });
    }

    res.status(200).send({
      success: true,
      message: "User đã được xóa mềm.",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi xóa mềm User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi xóa mềm User.",
    });
  }
});

router.post('/activate', async (req, res) => {
  try {
    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy User với thông tin đã cung cấp.",
      });
    }

    user.status = true; 
    await user.save();

    res.status(200).send({
      success: true,
      message: "User đã được kích hoạt thành công.",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi kích hoạt User:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi kích hoạt User.",
    });
  }
});


module.exports = router;
