const Order = require('../models/Order.model'); 
const Product = require('../models/Product.model'); 
const { StatusCodes } = require('http-status-codes'); 
const CustomErrors = require('../errors'); 
const Utils = require('../utils'); 

const fakeStripeApi = async ({ amount, current }) => {
  const client_secret = 'SomeRandomValue'; 
  return {client_secret, amount}
}

const createOrder = async (req, res) => {
  // check for items, tax, shippingFee coming from the frontEnd; 
  const {items: cartItems, shippingFee, tax} = req.body
  // check for cartItems as well as tax and shipping fee, throw errors
  if (!cartItems || cartItems.length < 1) {
    throw new CustomErrors.BadRequestError('No Items found in the cart'); 
  }
  if (!shippingFee || !tax) {
    throw new CustomErrors.BadRequestError('Please provide shipping fee and tax'); 
  }
  // set up the values, for the loop; 
  let orderItems = []; 
  let subtotal = 0
  // loop over the items array to check each cart item in the database; 
  for (const item of cartItems) {
    // find the individual item in the database; 
    const dbProduct = await Product.findOne({ _id: item.product }); 
    // check if not found, throw error
    if (!dbProduct) {
      throw new CustomErrors.NotFoundError(`Item with id: ${ item.product } was not found`); 
    }
    // if found deconstruct properties from the product object 
    const { name, price, image, _id } = dbProduct; 
    // construct a new object with required properties
    const SingleOrderItem = {
      amount: item.amount, 
      name, 
      price, 
      image, 
      product: _id
    }
    // add item to the order 
    orderItems = [ ...orderItems, SingleOrderItem ]
    // calculate subtotal 
    subtotal += item.amount * price; 
  }
  // calculate total 
  const total = subtotal + shippingFee + tax; 
  // get client secret 
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: 'usd',
  }); 
  // create the order 
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    shippingFee,
    tax,
    clientSecret: paymentIntent.client_secret,
    user: req.user.id
  });

  res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret});
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}); 
  res.status(StatusCodes.OK).json({ orders, count: orders.length }); 
}

const getCurrentUserOrder = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders || orders.length < 1) {
    throw new CustomErrors.NotFoundError('Order not found');
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { orderId } = req.params; 
  const order = await Order.findOne({ _id: orderId }); 
  if (!order) {
    throw new CustomErrors.NotFoundError(`Order with id: ${ orderId } was not found`);
  }
  Utils.checkPermissions(req.user, order.user); 
  res.status(StatusCodes.OK).json({ order }); 
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { paymentIntentId } = req.body
  
  const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new CustomErrors.NotFoundError(
        `Order with id: ${orderId} was not found`
      );
    }
  Utils.checkPermissions(req.user, order.user);
  
  order.paymentIntentId = paymentIntentId; 
  order.status = 'paid'; 
  await order.save(); 
  
  res.status(StatusCodes.OK).json({ order }); 
};

module.exports = {
  getAllOrders, 
  getSingleOrder, 
  getCurrentUserOrder, 
  createOrder, 
  updateOrder
}

