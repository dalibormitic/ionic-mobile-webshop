const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
