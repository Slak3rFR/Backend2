const productRepository = require('../repositories/productRepository');

class ProductService {
    async getAll() {
        return await productRepository.getAll();
    }

    async getById(id) {
        return await productRepository.getById(id);
    }

    async create(data, role) {
        if (role !== 'admin') throw new Error('Only admins can create products');
        return await productRepository.create(data);
    }

    async update(id, data, role) {
        if (role !== 'admin') throw new Error('Only admins can update products');
        return await productRepository.update(id, data);
    }

    async delete(id, role) {
        if (role !== 'admin') throw new Error('Only admins can delete products');
        return await productRepository.delete(id);
    }
}

module.exports = new ProductService();