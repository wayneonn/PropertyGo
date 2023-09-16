const { FAQ } = require("../../models");

const getFaq = (faqId) => {
    return FAQ.findOne({ where: { faqId }});
}

const getAllFaqs = async (req, res) => {
    const faqs = await FAQ.findAll();

    res.status(200).json({ faqs });
};

const getSingleFaq = async(req, res) => {
    try {
        const { id } = req.params;

        const faq = await getFaq(id);
    
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
    
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createFaq = async (req, res) => {

};

module.exports = {
    getAllFaqs,
    getSingleFaq,
    createFaq
};