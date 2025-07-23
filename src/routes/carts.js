const express = require('express');
const router = express.Router(); // Inicializa el router
const cartRepository = require('../repositories/cartRepository');
const ticketRepository = require('../repositories/ticketRepository'); // Importa ticketRepository
const { authMiddleware, authorizationMiddleware } = require('../passport');
const Product = require('../models/Product'); // Necesario para verificar stock

router.post('/', authMiddleware, async (req, res) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:cid', authMiddleware, async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/:cid/product/:pid', authMiddleware, authorizationMiddleware(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.addProduct(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', authMiddleware, authorizationMiddleware(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.removeProduct(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', authMiddleware, async (req, res) => {
    try {
        const cart = await cartRepository.update(req.params.cid, req.body.products);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', authMiddleware, authorizationMiddleware(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (product) product.quantity = req.body.quantity;
        await cart.save();
        res.json({ status: 'success', message: 'Quantity updated' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid', authMiddleware, authorizationMiddleware(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.clear(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Endpoint de compra
router.post('/:cid/purchase', authMiddleware, authorizationMiddleware(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        let totalAmount = 0;
        const outOfStock = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save();
            } else {
                outOfStock.push(product._id);
            }
        }

        // Filtrar productos fuera de stock
        cart.products = cart.products.filter(item => !outOfStock.includes(item.product));
        await cart.save();

        if (cart.products.length === 0) {
            const ticket = await ticketRepository.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });
            res.json({ status: 'success', message: 'Purchase completed', ticket });
        } else {
            res.json({ status: 'partial', message: 'Some products are out of stock', outOfStock });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;