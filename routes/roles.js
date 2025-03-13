const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const role = new Role({ name, description });
    await role.save();

    res.status(201).send({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("Lỗi khi tạo Role:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi tạo Role.",
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).send({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Role:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách Role.",
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy Role.",
      });
    }

    res.status(200).send({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("Lỗi khi lấy Role:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy Role.",
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy Role.",
      });
    }

    res.status(200).send({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật Role:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật Role.",
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy Role.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Role đã được xóa.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa Role:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi xóa Role.",
    });
  }
});

module.exports = router;
