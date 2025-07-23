const Cart = require('../models/Cart');

class CartDao {
    async create() {
        return await Cart.create({ products: [] });
    }

    async getById(id) {
        return await Cart.findById(id).populate('products.product').lean();
    }

    async addProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.products.push({ product: productId, quantity: 1 });
        return await cart.save();
    }

    async removeProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }

    async update(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true, runValidators: true }).lean();
    }

    async clear(cartId) {
        return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean();
    }
}

module.exports = new CartDao();