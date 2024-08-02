const mongoose = require('mongoose');
const DbConn = require('../config/config')


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

// create User model using the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;