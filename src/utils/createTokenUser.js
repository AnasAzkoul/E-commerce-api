const createUserToken = (user) => {
   const userToken = {
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role
   }
   return userToken; 
}

module.exports = createUserToken