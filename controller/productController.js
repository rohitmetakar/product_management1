const Product = require('../model/productModel')
const mongoose = require('mongoose');


let productController = {

    insertProduct: async function (req, res) {
        try {
            const { name, description, price, category_id } = req.body;
            // convert category_id to ObjectId
            const categoryObjectId = new mongoose.Types.ObjectId(category_id);

            if (!name || !description || !price || !category_id) {
                return res.status(400).json({ message: 'fields are required' });
            }
            const product = new Product({
                name,
                description,
                price,
                category_id: categoryObjectId
            });
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    },

    getProduct: async function (req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId).populate('category_id');
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getProduccts: async (req, res) => {
        try {
            const { category, page = 1, limit = 10 } = req.query;
            // create a query object if category is provided
            const query = category ? { category } : {};
            // find products on query, populate category details, paginate results
            const products = await Product.find(query)
                .populate('category_id')
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Product.countDocuments(query);
            res.status(200).json({ products, total, page, pages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

    },
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteProd: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getProductCatData: async (req, res) => {
        try {
            // use  aggregation to lookup and join categories  with products collection
            const products = await Product.aggregate([
                {
                    $lookup: {
                        from: 'categories',          // name of collection to join with
                        localField: 'category_id',   // field from the input documents
                        foreignField: '_id',         // field from the documents of the from table
                        as: 'categoryDetails'        // o/p array field
                    }
                },
                {
                    $unwind: '$categoryDetails'     // deconstructs the array field from the input documents
                }
            ]);
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    createDasboard: async function (req, res) {
        try {
            // Get the total count of products collection
            const totalProducts = await Product.countDocuments();

            // Use aggregation to calculate sales_trends by category
            const salesTrends = await Product.aggregate([
                {
                    $group: {
                        _id: "$category_id",         // group by category ID
                        totalSales: { $sum: "$price" } // sum prices of products in each category
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: '$categoryDetails'      // deconstructs  array field from the input documents
                }
            ]);
            res.status(200).json({ totalProducts, salesTrends });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = productController