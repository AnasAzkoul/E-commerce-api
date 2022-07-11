const path = require('path'); 
const Product = require('../models/Product.model'); 
const {StatusCodes} = require('http-status-codes'); 
const CustomError = require('../errors'); 

const getAllProducts = async (req, res) => {
   const products = await Product.find({}); 
   res.status(StatusCodes.OK).json({products, count: products.length}); 
}

const createProduct = async (req, res) => {
   req.body.user = req.user.id; 
   const product = await Product.create(req.body); 
   res.status(StatusCodes.CREATED).json(product); 
}

const getSingleProduct = async (req, res) => {
   const {productId} = req.params; 
   const product = await Product.findOne({_id: productId}).populate('reviews'); 
   if(!product) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`)
   }
   res.status(StatusCodes.OK).json(product)
}

const updateProduct = async (req, res) => {
   const {productId} = req.params; 

   const product = await Product.findByIdAndUpdate({_id: productId}, req.body, {
      new: true, runValidators: true
   }); 

   if(!product) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`)
   }
   res.status(StatusCodes.OK).json(product)
}

const deleteProduct = async (req, res) => {
   const {productId} = req.params; 
   const product = await Product.findOne({_id: productId}); 
   if(!product){
      throw new CustomError.NotFoundError(`No product with id: ${productId}`); 
   }
   await product.remove(); 

   res.status(StatusCodes.OK).json({msg: 'Product removed'}); 
}

const uploadImage = async (req, res) => {
   if(!req.files) {
      throw new CustomError.BadRequestError('No file uploaded'); 
   }
   const productImage = req.files.image; 

   if(!productImage.mimetype.startsWith('image')){
      throw new CustomError.BadRequestError('please upload an image'); 
   }
   const maxSize = 1024 * 1024 * 4
   if(productImage.size > maxSize){
      throw new CustomError.BadRequestError('please upload image smaller than 1MB')
   }
   const imagePath = path.join(
      __dirname, 
      '../../public/uploads/' + `${productImage.name}`
      ); 
   await productImage.mv(imagePath)
   res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`})
}

module.exports = {
   getAllProducts, 
   createProduct, 
   getSingleProduct, 
   updateProduct, 
   deleteProduct, 
   uploadImage
}