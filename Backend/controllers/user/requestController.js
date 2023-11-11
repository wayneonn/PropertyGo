const { Request, User, Notification } = require("../../models");
const sequelize = require('sequelize');

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