const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  //name is required
    },
    description: {
        type: String,
        required: true  // required
    },
    price: {
        type: Number,
        required: true  //required
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId, // define the type as an ObjectId
        ref: 'Category', // Reference to category collection
        required: true //  required
    }
});


// create User model using the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
