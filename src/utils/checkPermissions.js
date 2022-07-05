const CustomErrors = require('../errors'); 

const checkPermissions = (requestUser, resourceId) => {
   if (requestUser.role === 'admin') return; 
   if (requestUser.id === resourceId.toString()) return; 
   throw new CustomErrors.ForbiddenError('You are Unauthorized to view this document'); 
}

module.exports = checkPermissions