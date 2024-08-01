const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path( '/product_management/uploads')); // Set the destination folder for the uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the file name
    }
});
console.log("+++++++++++++++++++++")

const upload = multer({ storage: storage });

module.exports = upload; 