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


const productRouter = express.Router(); 

productRouter.route('/').get(getAllProducts); 

productRouter.post(
   '/createProduct', 
   authenticateUser,
   authorizePermissions('admin'),
   createProduct
)


productRouter.patch(
   '/updateProduct',
   authenticateUser,
   authorizePermissions('admin'),
   updateProduct
)

productRouter.delete(
   '/deleteProduct',
   authenticateUser,
   authorizePermissions('admin'),
   deleteProduct,
)

productRouter.route('/uploadImage').post(
   authenticateUser,
   authorizePermissions('admin'),
   uploadImage
)

productRouter.route('/:productId').get(getSingleProduct)



module.exports = productRouter
