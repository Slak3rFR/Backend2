const User = require('../models/User');

class UserDao {
    async getByEmail(email) {
        return await User.findOne({ email }).lean();
    }

    async create(data) {
        return await User.create(data);
    }

    async updatePassword(email, newPassword) {
        return await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
    }
}

module.exports = new UserDao();