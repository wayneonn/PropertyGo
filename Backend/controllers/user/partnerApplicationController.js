const {PartnerApplication, Folder} = require("../../models")


exports.getPartnerApplicationsByUserID = async (res, req) => {
    try {
        const folders = await PartnerApplication.findAll({where: {userId: req.params.id}});
        res.json({folders});
    } catch (error) {
        res
            .status(500)
            .json({message: "Error fetching Partner Applications: ", error: error.message});
    }
}

exports.postPartnerApplicationByUserID = async (res, req) => {
    console.log(req.body);
    try {
        const {companyName, userRole, cardNumber, cardHolderName, cvc, expiryDate, adminId, userId} = req.body;
        // Additional logic here if needed for input validation ---- deciding whether it should be on the frontend or backend.
        const newPartnerApplication = await PartnerApplication.create({
            companyName,
            userRole,
            cardNumber,
            cardHolderName,
            cvc,
            expiryDate,
            adminId,
            userId,
        });

        res.status(201).json(newPartnerApplication);
    } catch (error) {
        console.error('Error creating PartnerApplication', error);
        res.status(500).send({error: 'Error creating PartnerApplication'});
    }
};

