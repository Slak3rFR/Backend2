const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const mailService = require('../services/mailService');
const { v4: uuidv4 } = require('uuid');
const { jwtSecret } = require('../config/env');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const userDto = await authService.register(first_name, last_name, email, age, password);
        res.status(201).json({ message: 'Usuario registrado', user: userDto });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login(email, password);
        res.cookie('jwtToken', token, { httpOnly: true });
        res.json({ message: 'Login exitoso', token, user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await authService.getByEmail(email);
        if (!user) throw new Error('User not found');
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
        await mailService.sendResetPasswordEmail(email, token);
        res.json({ message: 'Reset password email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, jwtSecret);
        await authService.resetPassword(decoded.email, newPassword, req.body.oldPassword);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;