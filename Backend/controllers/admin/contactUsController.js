const moment = require("moment");
const { ContactUs } = require("../../models");

const getAllContactUs = async (req, res) => {
  try {
    const contactUss = await ContactUs.findAll({
      attributes: [
        "contactUsId",
        "title",
        "message",
        "reason",
        "status",
        "createdAt",
        "updatedAt",
        "userId",
        "adminId",
      ],
    });

    const formmatedContactUss = contactUss.map((contactUs) => {
      return {
        contactUsId: contactUs.contactUsId,
        title: contactUs.title,
        message: contactUs.message,
        reason: contactUs.reason,
        status: contactUs.status,
        createdAt: moment(contactUs.createdAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(contactUs.updatedAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
        userId: contactUs.userId,
        adminId: contactUs.adminId,
      };
    });

    res.status(200).json({ contactUs: formmatedContactUss });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleContactUs = async (req, res) => {
  try {
    const { id: contactUsId } = req.params;

    const contactUs = await ContactUs.findByPk(contactUsId);

    if (!contactUs) {
      return res.status(404).json({ message: "Contact Us not found" });
    }

    res.status(200).json(contactUs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const closeContactUs = async (req, res) => {
  const { id: contactUsId } = req.params;

  try {
    const contactUs = await ContactUs.findByPk(contactUsId);

    req.body.status = "CLOSED";
    req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    await contactUs.update(req.body);

    const updatedContactUs = await ContactUs.findByPk(contactUsId);

    res.status(200).json({ contactUs: updatedContactUs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllContactUs,
  getSingleContactUs,
  closeContactUs,
};
