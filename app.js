const express = require('express'); 
require('dotenv').config(); 
require('express-async-errors'); 
// Middlewares 
const morgan = require('morgan'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); 
// custom middleware 
const errorHandlerMiddleware = require('./src/middleware/error-handler'); 
const notFoundMiddleware = require('./src/middleware/not-found'); 
// MongoDb 
const connectDB = require('./src/db/connect'); 
// Routes 
const authRouter = require('./src/Routes/Auth.Router'); 
const userRouter = require('./src/Routes/User.Router'); 

const app = express(); 

// Middlewares 
app.use(express.json()); 
app.use(cookieParser(process.env.SECRET_JWT))
app.use(helmet()); 
app.use(cors()); 
app.use(morgan('combined')); 
app.use(express.static('./public')); 

// Routes
app.get('/', (req, res) => {
   res.send(`It's working`); 
})

app.get('/api/v1', (req, res) => {
   console.log(req.signedCookies);
   res.send(`It's working`);
})
app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/users', userRouter); 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); 


// Server and MongoDb setup 
const PORT = process.env.PORT || 5000

const MONGO_URI = process.env.MONGO_URI; 

const startServer = async () => {
   try {
      await connectDB(MONGO_URI); 
      app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`)); 
   } catch (error) {
      console.log(error)
   }
}

startServer(); 