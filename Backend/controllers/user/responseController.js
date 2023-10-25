const { ContactUs, User, Notification, Response } = require("../../models");

const addResponse = async (req, res) => {

    try {
        const response = await Response.create(req.body);

        const { contactUsId } = req.body;

        const contactUs = await ContactUs.findByPk(contactUsId);

        if (contactUs.status !== "PENDING") {
            contactUs.status = "PENDING";
        }

        await contactUs.save();

        req.io.emit("newResponseNotification", "New response has been created");

        res.status(201).json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addResponse,
};