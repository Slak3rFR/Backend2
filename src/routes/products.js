const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { authMiddleware, authorizationMiddleware } = require('../passport');

router.get('/', async (req, res) => {
    try {
        const products = await productService.getAll();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productService.getById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', authMiddleware, authorizationMiddleware(['admin']), async (req, res) => {
    try {
        const product = await productService.create(req.body, req.user.role);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(403).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', authMiddleware, authorizationMiddleware(['admin']), async (req, res) => {
    try {
        const product = await productService.update(req.params.pid, req.body, req.user.role);
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(403).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', authMiddleware, authorizationMiddleware(['admin']), async (req, res) => {
    try {
        const product = await productService.delete(req.params.pid, req.user.role);
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
        res.json({ status: 'success', message: 'Product deleted' });
    } catch (error) {
        res.status(403).json({ status: 'error', message: error.message });
    }
});

module.exports = (io) => {
    return router;
};