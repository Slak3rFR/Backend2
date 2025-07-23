const cartDao = require('../daos/cartDao');

class CartRepository {
    async create() {
        return await cartDao.create();
    }

    async getById(id) {
        return await cartDao.getById(id);
    }

    async addProduct(cartId, productId) {
        return await cartDao.addProduct(cartId, productId);
    }

    async removeProduct(cartId, productId) {
        return await cartDao.removeProduct(cartId, productId);
    }

    async update(cartId, products) {
        return await cartDao.update(cartId, products);
    }

    async clear(cartId) {
        return await cartDao.clear(cartId);
    }
}

module.exports = new CartRepository();