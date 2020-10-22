const express = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image!'));
    }
    cb(undefined, true);
  },
});

router.post('/products', auth, upload.single('image'), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  const product = new Product({ ...req.body, image: buffer });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/products', auth, async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/products/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findOne({ _id });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/products/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['productName', 'price', 'ingredients', 'description'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const product = await Product.findOne({ _id: req.params.id });
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
