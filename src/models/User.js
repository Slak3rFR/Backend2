const mongoose = require('mongoose');
require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.plugin(require('mongoose-unique-validator'));

const User = mongoose.model('User', userSchema);
module.exports = User;