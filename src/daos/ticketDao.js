const Ticket = require('../models/Ticket');

class TicketDao {
    async create(data) {
        return await Ticket.create(data);
    }
}

module.exports = new TicketDao();