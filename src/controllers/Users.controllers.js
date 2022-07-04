const User = require('../models/User.model'); 
const {
   UnauthenticatedError,
   BadRequestError,
   NotFoundError,
} = require('../errors'); 
const { StatusCodes } = require('http-status-codes'); 


const getAllUsers = async (req, res) => {
   console.log(req.user)
   const users = await User.find({ role: 'user' }).select('-password'); 
   res.status(StatusCodes.OK).json(users); 
}

const getOneUser = async (req, res) => {
   const {id} = req.params; 
   const user = await User.findOne({ _id: id }).select('-password'); 
   if (!user) {
      throw new NotFoundError('This user doe not exist, please provide a valid Id'); 
   }
   res.status(StatusCodes.OK).json(user);
}

const showCurrentUser = (req, res) => {
   res.send('Current User');
}

const updateUser = (req, res) => {
   res.send('user Updated');
}

const updateUserPassword = (req, res) => {
   res.send('User Password Updated');
}

module.exports = {
   getAllUsers, 
   getOneUser, 
   showCurrentUser, 
   updateUser, 
   updateUserPassword, 
}