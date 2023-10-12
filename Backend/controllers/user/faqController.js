const { FAQ } = require("../../models");

const getAllBuyerFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findAll({
            where: {
                faqType: "BUYER", 
            },
        });
        res.status(200).json(faq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllSellerFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findAll({
            where: {
                faqType: "SELLER",
            },
        });
        res.status(200).json(faq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllBuyerFAQ,
    getAllSellerFAQ
};