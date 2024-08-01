const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // env variables from .env file
const app = express();  //Initializes  express app
const mongoose = require('mongoose')
const authRoutes = require('./router/userRoutes.js')
const productRout = require('./router/productRoutes.js')

const verifyToken = require('./auth/middleware.js')


let connDb = require('./config/config.js')



const port = process.env.PORT; // Get the port number in env var


// Middleware
app.use(bodyParser.json()); // parse JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // parse urlencoded request  body
app.use(express.json()); // Parsed req JSON in body

// app.use('/', (req,res)=>{
//     res.json({message :  "hello product"})
// })


// Routes
app.use('/api/auth', authRoutes); // Set routes for user authentication 
app.use('/api', verifyToken, productRout); // Set  routes with jwt token verification


// Connect to MongoDB and start the server
connDb().then(() => {
    app.listen(port, () => {
        console.log(`Project started on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});