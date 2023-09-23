const moment = require('moment');
const { Response } = require("../../models");

const getAllResponses = async (req, res) => {
    const { id: contactUsId} = req.params;
    const { adminId, userId } = req.body;

    const responses = await Response.findAll({
        attributes: ['responseId', 'message', 'createdAt', 'updatedAt'],
        where: {
          adminId: adminId,
          contactUsId: contactUsId,
          userId: userId,
        },
      });

      const formattedResponses = responses.map(response => {
        return {
            responseId: response.responseId,
            message: response.message,
            createdAt: moment(response.createdAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment(response.updatedAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
        };
    });

    res.status(200).json({ responsesList: formattedResponses });
};

// const addResponse = async (req, res) => {

//     const { adminId, contactUsId } = req.body;

//     const responses = await Response.findAll({
//         attributes: ['responseId', 'message', 'createdAt', 'updatedAt'],
//         where: {
//           adminId: adminId,
//           contactUsId: contactUsId,
//           userId: userId,
//         },
//       });

//       const formattedResponses = responses.map(response => {
//         return {
//             responseId: response.responseId,
//             message: response.message,
//             createdAt: moment(response.createdAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
//             updatedAt: moment(response.updatedAt).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss'),
//         };
//     });

//     res.status(200).json({ responsesList: formattedResponses });
// };

module.exports = {
    getAllResponses
}