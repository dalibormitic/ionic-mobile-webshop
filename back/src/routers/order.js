const express = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = new express.Router();
const { sendEmailToCustomer, sendEmailToSeller } = require('../emails/mail');

router.post('/orders', auth, async (req, res) => {
  const order = new Order(req.body);
  try {
    await order.save();
    await sendEmailToCustomer(req.user, order);
    await sendEmailToSeller(req.user, order);
    res.status(201).send(order);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/orders/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    await req.user.populate('orders').execPopulate();
    res.send(req.user.orders);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
