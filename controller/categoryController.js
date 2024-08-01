const Category = require('../model/categoryModel')

const categoryController = {


    insertCategory: async function (req, res) {
        try {
            const category = new Category(req.body);
            await category.save();
            res.status(201).json(category);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    },

    getCategory: async (req, res) => {
        try {
            let categories = await Category.find();
            res.status(200).json(categories);
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = categoryController