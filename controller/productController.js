const Product = require('../model/productModel')
const mongoose = require('mongoose');


let productController = {

    insertProduct: async function (req, res) {
        try {
            const { name, description, price, category_id } = req.body;
            const image = req.file ? req.file.path : null; // Get the uploaded file path
            console.log(req.image );


            // Convert category_id to ObjectId
            const categoryObjectId = new mongoose.Types.ObjectId(category_id);

            if (!name || !description || !price || !category_id) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const product = new Product({
                name,
                description,
                price,
                image,
                category_id: categoryObjectId
            });
            console.log('product :>>>', product);
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
            const query = category ? { category } : {};
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
            const products = await Product.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: '$categoryDetails'
                }
            ]);

            console.log('product:>>>>', products)
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    createDasboard: async function (req, res) {
        try {
            const totalProducts = await Product.countDocuments();
            const salesTrends = await Product.aggregate([
                {
                    $group: {
                        _id: "$category_id",
                        totalSales: { $sum: "$price" }
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
                    $unwind: '$categoryDetails'
                }
            ]);
            res.status(200).json({ totalProducts, salesTrends });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = productController