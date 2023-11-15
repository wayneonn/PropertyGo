const { Request, Transaction, User, Notification } = require("../../models");
const sequelize = require('sequelize');

// Create a new Request
exports.getRequest = async (req, res) => {
    try {
        const newRequest = await Request.create(req.body);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Requests
exports.findRequest = async (req, res) => {
    try {
        const requests = await Request.findAll();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Request by ID
exports.getSingleRequest = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id, {
            include: [{
                model: Transaction,
                as: 'transactions' // Replace 'transactions' with the alias you have used in your association, if any
            }]
        });
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Request
exports.updateRequest = async (req, res) => {
    try {
        const updated = await Request.update(req.body, {
            where: { requestId: req.params.id },
        });
        if (updated) {
            res.json({ message: 'Request updated successfully' });
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Request
exports.deleteRequest = async (req, res) => {
    try {
        const deleted = await Request.destroy({
            where: { requestId: req.params.id },
        });
        if (deleted) {
            res.json({ message: 'Request deleted successfully' });
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.findRequestByPartnerId = async (req, res) => {
    try {
        const requests = await Request.findAll({
            where: { userId: req.params.partnerId }
        });
        if (requests.length > 0) {
            res.json(requests);
        } else {
            res.status(404).json({ error: 'No requests found for the given receiverId' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createRequest = async (req, res) => {
    const userId = parseInt(req.params.userId);

    // Assuming you want to set userId in the Request model
    req.body.userId = userId;

    try {
        const request = await Request.create(req.body);
        res.status(201).json({ request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateRequest = async (req, res) => {
    const requestId = parseInt(req.params.requestId);
    const {requestStatus , price} = req.body

    const request = await Request.findByPk(requestId)

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    try {

        if (requestStatus) {
            request.requestStatus = requestStatus;
        }
        
        if(price) {
            request.price = price;
        }
        
        await request.save(); // Use 'await' to ensure the save operation is complete
        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createRequest,
    updateRequest
};
