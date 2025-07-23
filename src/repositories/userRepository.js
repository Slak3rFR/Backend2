const userDao = require('../daos/userDao');

class UserRepository {
    async getByEmail(email) {
        return await userDao.getByEmail(email);
    }

    async create(data) {
        return await userDao.create(data);
    }

    async updatePassword(email, newPassword) {
        return await userDao.updatePassword(email, newPassword);
    }
}

module.exports = new UserRepository();