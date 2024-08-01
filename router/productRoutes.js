const productController = require('../controller/productController')
const categoryController = require('../controller/categoryController')
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); 


// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
  });
  
  const upload = multer({ storage: storage });

  // Create uploads directory if it doesn't exist
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


console.log('upload :>>>>',upload)

router.post('/insertProduct', upload.single('image'), productController.insertProduct)

router.get('/getProduct/:id', productController.getProduct)

router.get('/getProducts', productController.getProduccts)

router.put('/updateProduct/:id', productController.updateProduct)

router.delete('/deleteProd/:id', productController.deleteProd)

router.post('/insertCategory', categoryController.insertCategory)

router.get('/getCategory', categoryController.getCategory)

router.get('/getProdData', productController.getProductCatData)

router.get('/createDasboard', productController.createDasboard)
module.exports = router