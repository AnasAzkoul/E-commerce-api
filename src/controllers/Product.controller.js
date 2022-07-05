const Product = require('../models/Product.model'); 

const getAllProducts = async (req, res) => {
   res.send('get all products')
}

const createProduct = async (req, res) => {
   res.send('product created')
}

const getSingleProduct = async (req, res) => {
   res.send('One product')
}

const updateProduct = async (req, res) => {
   res.send('product Updated')
}

const deleteProduct = async (req, res) => {
   res.send('product deleted')
}

const uploadImage = async (req, res) => {
   res.send('upload image')
}

module.exports = {
   getAllProducts, 
   createProduct, 
   getSingleProduct, 
   updateProduct, 
   deleteProduct, 
   uploadImage
}