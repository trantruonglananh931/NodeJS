var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product');

function buildQuery(obj) {
  console.log(obj);
  let result = {};
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  result.price = {};
  if (obj.price) {
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    } else {
      result.price.$lte = 10000;
    }
  }
  return result;
}

router.get('/', async function (req, res, next) {
  try {
    let products = await productModel.find({}); 
    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error); 
    res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách sản phẩm.",
    });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm với ID này.",
      });
    }
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "ID không hợp lệ hoặc không tồn tại.",
    });
  }
});

router.post('/', async function (req, res, next) {
  try {
    // Kiểm tra và xử lý giá trị của price
    let price = req.body.price;
    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).send({
        success: false,
        message: "Giá trị của 'price' phải là một số hợp lệ.",
      });
    }

    let newProduct = new productModel({
      name: req.body.name,
      price: price,
      quantity: req.body.quantity,
      category: req.body.category,
    });

    await newProduct.save();
    res.status(200).send({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});


router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;

    let price = req.body.price;
    if (price !== undefined && (typeof price !== 'number' || isNaN(price))) {
      return res.status(400).send({
        success: false,
        message: "Giá trị của 'price' phải là một số hợp lệ.",
      });
    }

    let updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: price,
        quantity: req.body.quantity,
        category: req.body.category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm với ID này.",
      });
    }

    res.status(200).send({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm với ID này.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Sản phẩm đã được xóa thành công.",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
