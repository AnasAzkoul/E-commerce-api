const Review = require('../models/Review.model'); 
const Product = require('../models/Product.model'); 
const {StatusCodes} = require('http-status-codes'); 
const CustomErrors = require('../errors'); 
const Utils = require('../utils'); 

const createReview = async (req, res) => {
    const {product: productId} = req.body; 
    const isValidProduct = await Product.findOne({_id: productId}); 
    if(!isValidProduct) {
        throw new CustomErrors.NotFoundError(`No Product with id: ${productId}`); 
    }
    const alreadySubmitted = await Review.findOne({
        product: productId, 
        user: req.user.id
    })
    if(alreadySubmitted){
        throw new CustomErrors.BadRequestError('You have already submitted a review for this product'); 
    }
    req.body.user = req.user.id; 
    const review = await Review.create(req.body); 
    res.status(StatusCodes.CREATED).json(review); 
}

const getAllReviews = async(req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product', 
        select: 'name company price'
    }); 
    res.status(StatusCodes.OK).json({reviews, count: reviews.length}); 
}

const getSingleReview = async(req, res) => {
    const {reviewId} = req.params; 
    const review = await Review.findOne({_id: reviewId}).populate({
        path: 'product', 
        select: 'name company price'
    }); 
    if(!review) {
        throw new CustomErrors.NotFoundError(`No review with id: ${reviewId}`)
    }
    res.status(StatusCodes.OK).json(review)
}

const updateReview = async(req, res) => {
    const {reviewId} = req.params; 
    const {rating, title, comment} = req.body; 
    const review = await Review.findOne({_id: reviewId}); 
    if(!review){
        throw new CustomErrors.NotFoundError(`No review with id: ${reviewId}`)
    }
    Utils.checkPermissions(req.user, review.user); 
    review.rating = rating 
    review.title = title
    review.comment = comment

    await review.save()
    res.status(StatusCodes.OK).json(review); 
}

const deleteReview = async(req, res) => {
    const {reviewId} = req.params; 
    const review = await Review.findOne({_id: reviewId}); 
    if(!review){
        throw new CustomErrors.NotFoundError(`No review with id: ${reviewId}`); 
    }
    Utils.checkPermissions(req.user, review.user); 
    await review.remove(); 
    res.status(StatusCodes.OK).json({msg: 'Success, review is deleted'}); 
}

const getSingleProductReviews = async(req, res) =>{
    const {productId} = req.params; 
    const reviews = await Review.find({product: productId}); 
    res.status(StatusCodes.OK).json({reviews, count: reviews.length}); 
}

module.exports = {
    createReview, 
    getAllReviews, 
    getSingleReview, 
    updateReview, 
    deleteReview,
    getSingleProductReviews, 
}