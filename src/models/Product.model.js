const mongoose = require('mongoose'); 

const ProductSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name of the product'], 
      trim: true, 
      maxlength: [100, 'cannot be more than 100 characters']
   },
   price: {
      type: Number,
      required: [true, 'Please Provide price'], 
      default: 10
   },
   description: {
      type: String,
      required: [true, 'Please provide description'], 
      maxlength: [1000, 'description cannot be more than 1000 characters']
   },
   image: {
      type: String,
      default: '/uploads/example.jpeg'
   },
   category: {
      type: String,
      enum: ['office', 'kitchen', 'bedroom'], 
      required: [true, 'Please provide category']
   },
   company: {
      type: String,
      required: [true, 'Please provide company'], 
      enum: {
         values: ['ikea', 'liddy', 'marcos'], 
         message: `is not supported`
      }
   },
   colors: {
      type: [String], 
      default: ['#222'], 
      required: true, 
   },
   featured: {
      type: Boolean,
      default: false, 
   },
   freeShipping: {
      type: Boolean,
      default: false,
   },
   inventory: {
      type: Number, 
      default: 15, 
      required: true
   },
   averageRating: {
      type: Number, 
      default: 0
   },
   user: {
      type: mongoose.Types.ObjectId, 
      ref: 'User', 
      required: true, 
   },
}, { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
); 

ProductSchema.virtual('reviews', {
   ref: 'Review', 
   localField: '_id', 
   foreignField: 'product', 
   justOne: false
})

ProductSchema.pre('remove', async function (next) {
   await this.model('Review').deleteMany({product: this._id}); 
})

module.exports = mongoose.model('Product', ProductSchema); 