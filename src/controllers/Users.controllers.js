const User = require('../models/User.model'); 
const CustomError = require('../errors'); 
const { StatusCodes } = require('http-status-codes'); 


const getAllUsers = async (req, res) => {
   const users = await User.find({ role: 'user' }).select('-password'); 
   res.status(StatusCodes.OK).json(users); 
}

const getOneUser = async (req, res) => {
   const {id} = req.params; 
   const user = await User.findOne({ _id: id }).select('-password'); 
   if (!user) {
      throw new CustomError.NotFoundError('This user doe not exist, please provide a valid Id'); 
   }
   res.status(StatusCodes.OK).json(user);
}

const showCurrentUser = async (req, res) => {
   res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = (req, res) => {
   res.send('user Updated');
}

const updateUserPassword = async (req, res) => {
   const { oldPassword, newPassword } = req.body
   if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError('Please provide both values')
   }
   const user = await User.findOne({ _id: req.user.id })
   const isPasswordCorrect = await user.comparePassword(oldPassword); 
   if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Old password is invalid'); 
   }
   user.password = newPassword; 

   await user.save(); 
   res.status(StatusCodes.OK).json({msg: 'Success!, password updated'});
}

module.exports = {
   getAllUsers, 
   getOneUser, 
   showCurrentUser, 
   updateUser, 
   updateUserPassword, 
}