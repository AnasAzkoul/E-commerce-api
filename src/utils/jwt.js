const jwt = require('jsonwebtoken'); 

const createToken =  ({payload}) => {
   const token =  jwt.sign(payload, process.env.SECRET_JWT, {
      expiresIn: process.env.LIFE_TIME
   })

   return token; 
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.SECRET_JWT); 

const attachCookiesToResponse = (res, tokenUser) => {
   const oneDay = 1000 * 60 * 60 * 24
   const token = createToken({payload: tokenUser}); 
   res.cookie('token', token, {
      httpOnly: true, 
      expires: new Date(Date.now() + oneDay), 
      secure: process.env.NODE_ENV === 'production', 
      signed: true
   })
}


module.exports = {
   createToken, 
   isTokenValid, 
   attachCookiesToResponse
}


