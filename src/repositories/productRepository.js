const productDao = require('../daos/productDao');

class ProductRepository {
    async getAll() {
        return await productDao.getAll();
    }

    async getById(id) {
        return await productDao.getById(id);
    }

    async create(data) {
        return await productDao.create(data);
    }

    async update(id, data) {
        return await productDao.update(id, data);
    }

    async delete(id) {
        return await productDao.delete(id);
    }
}

module.exports = new ProductRepository();