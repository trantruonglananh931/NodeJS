const express = require('express');
const router = express.Router();
const Category = require('../schemas/category');

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "Danh mục đã tồn tại.",
      });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).send({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi tạo danh mục.",
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách danh mục.",
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục.",
      });
    }

    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh mục.",
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục.",
      });
    }

    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật danh mục.",
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Danh mục đã được xóa.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi xóa danh mục.",
    });
  }
});

module.exports = router;
