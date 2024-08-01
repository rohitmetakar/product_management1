# product_management
A RESTful API for managing mongo DB, create user, product, category collaction.
# Code structure
    1. create app.js file for server
    2. create auth middleware file for verify user jwt token.
    3. create config file for database connection.
    4. create utils file for send email for forget password.
    5. create model file for user, product, and category schema.
    6. create controller for buisness logic for user, and product.
    7.creaet .env file for adding :
                PORT = 4010
                MONGO_URI = "mongodb+srv://rohitmetakar3112:************@cluster0.iyzpdih.mongodb.net/product_management?retryWrites=true&w=majority&appName=Cluster0"
                JWT_SECRET=your_jwt_secret
                EMAIL_USER=maddison53@ethereal.email
                EMAIL_PASS=jn7jnAPss4f63QBp6D
# Database name : 
    product_management
# Project run :
    npm run app.js
# dependencies : 
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "config": "^3.3.12",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.2",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.14"
