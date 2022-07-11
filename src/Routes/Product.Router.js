const express = require('express'); 

const {
   authenticateUser,
   authorizePermissions
} = require('../middleware/authentication'); 

const {
   getAllProducts,
   createProduct,
   getSingleProduct,
   updateProduct,
   deleteProduct,
   uploadImage
} = require('../controllers/Product.controller'); 

const {getSingleProductReviews} = require('../controllers/Review.controller')


const productRouter = express.Router(); 

productRouter
   .route('/')
   .get(getAllProducts)
   .post([authenticateUser, authorizePermissions('admin')], createProduct)

productRouter.route('/uploadImage').post(
   authenticateUser,
   authorizePermissions('admin'),
   uploadImage
)
   
productRouter
   .route('/:productId')
   .get(getSingleProduct)
   .patch([authenticateUser,authorizePermissions('admin')],updateProduct)
   .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

productRouter.route('/:productId/reviews').get(getSingleProductReviews); 

module.exports = productRouter
