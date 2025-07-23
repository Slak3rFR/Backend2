const { createHash, isValidPassword } = require('../utils');
const userRepository = require('../repositories/userRepository');
const UserDto = require('../dtos/userDto');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

class AuthService {
    async register(first_name, last_name, email, age, password) {
        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) throw new Error('Email already registered');
        const hashedPassword = createHash(password);
        const cart = (await require('../models/Cart').create({ products: [] }))._id;
        const user = await userRepository.create({ first_name, last_name, email, age, password: hashedPassword, cart, role: 'user' });
        return new UserDto(user);
    }

    async login(email, password) {
        const user = await userRepository.getByEmail(email);
        if (!user || !isValidPassword(user, password)) throw new Error('Invalid credentials');
        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        return { token, user: new UserDto(user) };
    }

    async resetPassword(email, newPassword, oldPassword) {
        const user = await userRepository.getByEmail(email);
        if (!user) throw new Error('User not found');
        if (isValidPassword(user, newPassword)) throw new Error('New password cannot be the same as the old one');
        const hashedPassword = createHash(newPassword);
        await userRepository.updatePassword(email, hashedPassword);
    }
}

module.exports = new AuthService();