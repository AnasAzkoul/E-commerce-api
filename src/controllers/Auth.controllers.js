const User = require('../models/User.model'); 
const { StatusCodes } = require('http-status-codes'); 
const {
   BadRequestError, 
   UnauthenticatedError
} = require('../errors'); 
const {
   createToken,
   attachCookiesToResponse
} = require('../utils'); 

const register = async (req, res) => {
   const { name, email, password } = req.body; 

   const checkEmail = await User.findOne({ email: email }); 

   if (checkEmail) {
      throw new BadRequestError('This email is already in use'); 
   }

   const isFirstAccount = (await User.countDocuments({})) === 0;
   const role = isFirstAccount ? 'admin' : 'user'; 

   const user = await User.create({ name, email, password, role }); 

   const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
   }
   
   attachCookiesToResponse(res, userPayload); 
   res.status(StatusCodes.CREATED).json({user: userPayload}); 
}

const logIn = async (req, res) => {
   const { email, password } = req.body; 
   if (!email || !password) {
      throw new BadRequestError('Please provide email and password'); 
   }
   const user = await User.findOne({ email }); 
   if (!user) {
      throw new UnauthenticatedError('The email you are trying to use does not exist'); 
   }
   const isPasswordValid = await user.comparePassword(password); 

   if (!isPasswordValid) {
      throw new UnauthenticatedError('Password is not valid'); 
   }
   const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
   }

   attachCookiesToResponse(res, userPayload); 

   res.status(StatusCodes.OK).json(userPayload); 
}

const logOut = async (req, res) => {
   res.cookie('token', 'Logout', {
      httpOnly: true, 
      expires: new Date(Date.now()), 
      secure: process.env.NODE_ENV === 'production', 
      signed: true, 
   })
   res.status(StatusCodes.OK).json({ msg: 'User Logged out' }); 
}

module.exports = {
   register, 
   logIn, 
   logOut
}
