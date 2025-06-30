const express = require('express');
const router = express.Router();
const { passport } = require('../passport');

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user;
    res.json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role
    });
});

module.exports = router;