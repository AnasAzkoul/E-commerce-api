const express = require('express'); 
const {
    createReview, 
    getAllReviews, 
    getSingleReview, 
    updateReview, 
    deleteReview
} = require('../controllers/Review.controller'); 
const {
    authenticateUser, 
 } = require('../middleware/authentication');  

const reviewRouter = express.Router(); 

reviewRouter.route('/')
.get(getAllReviews)
.post(authenticateUser, createReview); 


reviewRouter.route('/:reviewId')
.get(getSingleReview)
.patch(authenticateUser, updateReview)
.delete(authenticateUser, deleteReview)


module.exports = reviewRouter; 
