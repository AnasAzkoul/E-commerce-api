const express = require('express'); 

const {
   getAllUsers,
   getOneUser,
   showCurrentUser,
   updateUser,
   updateUserPassword,
} = require('../controllers/Users.controllers'); 
const {
   authenticateUser,
   authorizePermissions
} = require('../middleware/authentication'); 

const userRouter = express.Router(); 

userRouter.route('/').get(
   authenticateUser,
   authorizePermissions('admin'),
   getAllUsers
)

userRouter.route('/showMe').get(authenticateUser, showCurrentUser)

userRouter.route('/updateUser').patch(authenticateUser, updateUser)

userRouter.route('/updateUserPassword').patch(authenticateUser, updateUserPassword); 

userRouter.route('/:id').get(authenticateUser, getOneUser)



module.exports = userRouter; 