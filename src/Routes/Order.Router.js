const express = require('express'); 
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder
} = require('../controllers/Order.controller'); 
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication'); 

const orderRouter = express.Router()

orderRouter.route('/')
  .get(authenticateUser, authorizePermissions('admin'),getAllOrders)
  .post(authenticateUser, createOrder)

orderRouter.route('/showAllMyOrders')
  .get(authenticateUser, getCurrentUserOrder)

orderRouter.route('/:orderId')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = orderRouter; 

