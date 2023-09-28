const moment = require("moment");
const { ContactUs, Response } = require("../../models");

const getAllResponses = async (req, res) => {
    const { id: contactUsId } = req.params;

    const responses = await Response.findAll({
        attributes: ['responseId', 'message', 'createdAt', 'updatedAt', 'userId', 'adminId'],
        where: {
            contactUsId: contactUsId,
        },
    });

    const formattedResponses = responses.map(response => {
        return {
            responseId: response.responseId,
            message: response.message,
            userId: response.userId,
            adminId: response.adminId,
            createdAt: moment(response.createdAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment(response.updatedAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
        };
    });

    res.status(200).json({ responsesList: formattedResponses });
};

const addResponse = async (req, res) => {
  const response = await Response.create(req.body);

  // update the status of contact us to be 'REPLIED'
  const { contactUsId, adminId } = req.body;

  const contactUs = await ContactUs.findByPk(contactUsId);

  if (contactUs.status !== "REPLIED") {
    contactUs.status = "REPLIED";
    contactUs.adminId = adminId;
  }

  contactUs.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  await contactUs.save();

  res.status(201).json({ response });
};

const editResponse = async (req, res) => {
  const { id: responseId } = req.params;

  const response = await Response.findByPk(responseId);

  if (!response) {
    return res.status(404).json({ message: "Response not found" });
  }

  response.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  await response.update(req.body);

  const updatedResponse = await Response.findByPk(responseId);

  res.status(200).json({ response: updatedResponse });
};

const deleteResponse = async (req, res) => {
  const { id: responseId } = req.params;

  const response = await Response.findByPk(responseId);

  if (!response) {
    return res.status(404).json({ message: "Response not found" });
  }

  await response.destroy();
  res.status(200).json({ msg: "Success! Response removed." });
};

module.exports = {
  getAllResponses,
  addResponse,
  editResponse,
  deleteResponse,
};