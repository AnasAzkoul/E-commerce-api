const express = require('express'); 
const {
   register,
   logIn,
   logOut
} = require('../controllers/Auth.controllers'); 


const authRouter = express.Router(); 

authRouter.route('/register').post(register); 
authRouter.route('/login').post(logIn); 
authRouter.route('/logout').get(logOut); 


module.exports = authRouter; 

