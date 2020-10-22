const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const orderRouter = require('./routers/order');

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT);
});
