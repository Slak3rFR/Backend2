const Product = require('../models/Product');

class ProductDao {
    async getAll() {
        return await Product.find().lean();
    }

    async getById(id) {
        return await Product.findById(id).lean();
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductDao();