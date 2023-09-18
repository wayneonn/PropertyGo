const { FAQ } = require("../../models");

// helper function
const getFaqForUniqueness = ({question, faqType}) => {
    return FAQ.findOne({ 
        where: { 
            question,
            faqType
        }
    });
};

const getAllFaqs = async (req, res) => {
    const faqs = await FAQ.findAll();

    res.status(200).json({ faqs });
};

const getSingleFaq = async (req, res) => {
    try {
        const { id: faqId} = req.params;

        const faq = await FAQ.findByPk(faqId);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createFaq = async (req, res) => {
    const { adminId } = req.query;

    const { question, faqType } = req.body;

    const questionFound = await getFaqForUniqueness({question, faqType});

    if (questionFound) {
        return res.status(409).json({ message: `Question already exist in ${faqType}.` });
    }

    req.body.adminId = adminId;

    const faq = await FAQ.create(req.body);
    res.status(201).json({ faq });
};

const updateFaq = async (req, res) => {
    const { id: faqId } = req.params;

    const { question, faqType } = req.body;

    const questionFound = await getFaqForUniqueness({question, faqType});

    if (questionFound) {
        return res.status(409).json({ message: `Question already exist in ${faqType}.` });
    }

    try {
        const faq = await FAQ.findByPk(faqId);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await faq.update(req.body);

        const updatedFaq = await FAQ.findByPk(faqId);

        res.status(200).json({ faq: updatedFaq });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteFaq = async (req, res) => {
    const { id: faqId } = req.params;

    const faq = await FAQ.findByPk(faqId);

    if (!faq) {
        return res.status(404).json({ message: "FAQ not found" }); 
    }

    await faq.destroy();
    res.status(200).json({ msg: 'Success! FAQ removed.' });
};

module.exports = {
    getAllFaqs,
    getSingleFaq,
    createFaq,
    updateFaq,
    deleteFaq
};