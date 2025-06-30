const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { createHash } = require('../utils');
const { passport } = require('../passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../passport');

// Registro
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const cart = await (await require('../models/Cart').create({ products: [] }))._id; // Crea un carrito vacío
        const hashedPassword = createHash(password);
        const user = await User.create({ first_name, last_name, email, age, password: hashedPassword, cart, role: 'user' });
        res.status(201).json({ message: 'Usuario registrado', user: { _id: user._id, email: user.email } });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

// Login
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token });
});

module.exports = router;