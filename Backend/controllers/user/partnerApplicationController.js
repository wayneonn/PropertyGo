const {PartnerApplication, Folder} = require("../../models")

/*
* Partner Application Controller.
* API Routes available:
* 1. CR => Only can create and read PartnerApp. Cannot delete them (manual delete in server), cannot update them (only update documents)
* 2. There should only be one Approved = False application in the database. (KIV feature, not important).
*
*
*
*
*
* */
exports.getAllPartnerApplicationsNotApproved = async (req, res) => {
    try {
        const partnerApp = await PartnerApplication.findAll({where: {approved: 0}});
        res.json({partnerApp});
    } catch (error) {
        res.status(500)
            .json({message: "Error fetching approved Partner Applications: ", error: error.message});
    }
}

exports.getPartnerApplicationsByUserID = async (req, res) => {
    try {
        const partnerApp = await PartnerApplication.findAll({where: {userId: req.params.id}});
        res.json({partnerApp});
    } catch (error) {
        res.status(500)
            .json({message: "Error fetching Partner Applications: ", error: error.message});
    }
}

exports.postPartnerApplicationByUserID = async (req, res) => {
    console.log(req.body);
    try {
        const {companyName, userRole, cardNumber, cardHolderName, cvc, expiryDate, userId} = req.body;
        // Additional logic here if needed for input validation ---- deciding whether it should be on the frontend or backend.
        console.log(expiryDate)
        const adminId = 1; // Hardcode 1 since Admin only has two.
        const [month, year] = expiryDate.split('/');
        const yearNum = Number.parseInt(year)
        const monthNum = Number.parseInt(month)
        const formatDate = new Date(yearNum, monthNum - 1); // Month at zero-index.
        console.log("Formatted Date: ", formatDate)
        const newPartnerApplication = await PartnerApplication.create({
            companyName,
            userRole,
            cardNumber,
            cardHolderName,
            cvc,
            "expiryDate": formatDate,
            adminId,
            userId,
        });

        res.status(201).json(newPartnerApplication);
    } catch (error) {
        console.error('Error creating PartnerApplication', error);
        res.status(500).send({error: 'Error creating PartnerApplication'});
    }
};

exports.updatePartnerApplicationByID = async (req, res) => {
    console.log(req.body);
    try {
        const updatedApp = await PartnerApplication.update({ approved: true },
            {
                where: {
                    partnerApplicationId: req.params.id
                }
            }
        );
        res.status(201).json(updatedApp);
    } catch(error) {
        console.error('Error updating PartnerApplication', error);
        res.status(500).send({error: 'Error updating PartnerApplication'});
    }
}

