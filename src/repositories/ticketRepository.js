const ticketDao = require('../daos/ticketDao');

class TicketRepository {
    async create(data) {
        return await ticketDao.create(data);
    }
}

module.exports = new TicketRepository();