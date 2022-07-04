const CustomErr = require('../errors'); 
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
   const { token } = req.signedCookies;
   if (!token) {
      throw new CustomErr.UnauthenticatedError('Authentication Invalid')
   }

   try {
      const payload = isTokenValid({ token });
      req.user = {
         id: payload.id,
         name: payload.name,
         email: payload.email,
         role: payload.role
      }
      next()
   } catch (error) {
      throw new CustomErr.UnauthenticatedError('Invalid credentials');
   }
}

const authorizePermissions = (...roles) => {
   return (req, res, next) => {
      const { role } = req.user
      if (!roles.includes(role)) {
         throw new CustomErr.ForbiddenError('Invalid Admin Credentials')
      }
      next()
   }
}


module.exports = {
   authenticateUser, 
   authorizePermissions
}