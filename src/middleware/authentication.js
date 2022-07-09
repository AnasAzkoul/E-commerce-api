const CustomError = require('../errors'); 
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
   const { token } = req.signedCookies;
   if (!token) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
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
      throw new CustomError.UnauthenticatedError('Invalid credentials');
   }
}

const authorizePermissions = (...roles) => {
   return (req, res, next) => {
      const { role } = req.user
      if (!roles.includes(role)) {
         throw new CustomError.ForbiddenError('Invalid Admin Credentials')
      }
      next()
   }
}


module.exports = {
   authenticateUser, 
   authorizePermissions
}