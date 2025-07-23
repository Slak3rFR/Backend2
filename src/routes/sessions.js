const express = require('express');
const router = express.Router();
const UserDto = require('../dtos/userDto');
const { authMiddleware } = require('../passport');

router.get('/current', authMiddleware, (req, res) => {
    const userDto = new UserDto(req.user);
    res.json({ user: userDto });
});

module.exports = router;