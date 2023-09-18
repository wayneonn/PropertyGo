const { ContactUs } = require("../../models");

const getAllContactUs = async (req, res) => {
    const contactUs = await ContactUs.findAll();

    res.status(200).json({ contactUs });
};

const getSingleContactUs = async (req, res) => {
    try {
        const { id: contactUsId} = req.params;

        const contactUs = await ContactUs.findByPk(contactUsId);

        if (!contactUs) {
            return res.status(404).json({ message: "Contact Us not found" });
        }

        res.status(200).json(contactUs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const respondContactUs = async (req, res) => {
    const { id: contactUsId } = req.params;

    try {
        const contactUs = await ContactUs.findByPk(contactUsId);

        req.body.status = "REPLIED";

        await contactUs.update(req.body);

        const updatedContactUs = await ContactUs.findByPk(contactUsId);

        res.status(200).json({ contactUs : updatedContactUs });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    getAllContactUs,
    getSingleContactUs,
    respondContactUs
}