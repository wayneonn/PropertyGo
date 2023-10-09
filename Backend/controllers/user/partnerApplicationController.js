const {PartnerApplication, Folder, User, Notification} = require("../../models")
const globalEmitter = require('../../globalEmitter')

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

        const formattedPartnerApps = await Promise.all(
            partnerApp.map(async (pa) => {

                const user = await User.findByPk(pa.userId);

                return {
                    partnerApplicationId: pa.partnerApplicationId,
                    companyName: pa.companyName,
                    userRole: pa.userRole,
                    cardNumber: pa.cardNumber,
                    cardHolderName: pa.cardHolderName,
                    cvc: pa.cvc,
                    expiryDate: pa.expiryDate,
                    approved: pa.approved,
                    adminNotes: pa.adminNotes,
                    createdAt: pa.createdAt,
                    updatedAt: pa.updatedAt,
                    adminId: pa.adminId,
                    userId: pa.userId,
                    username: user.userName
                    // topicName: forumTopic.topicName,
                    // isInappropriate: forumTopic.isInappropriate,
                    // actor: actor,
                    // createdAt: moment(forumTopic.createdAt)
                    //     .tz("Asia/Singapore")
                    //     .format("YYYY-MM-DD HH:mm:ss"),
                    // updatedAt: moment(forumTopic.updatedAt)
                    //     .tz("Asia/Singapore")
                    //     .format("YYYY-MM-DD HH:mm:ss"),
                };
            })
        );

        res.json({partnerApp: formattedPartnerApps});
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
        globalEmitter.emit("partnerCreated");
        res.status(201).json(newPartnerApplication);
    } catch (error) {
        console.error('Error creating PartnerApplication', error);
        res.status(500).send({error: 'Error creating PartnerApplication'});
    }
};

exports.updatePartnerApplicationByID = async (req, res) => {
    // console.log(req.body);
    // const today = new Date();
    // const nextYear = new Date(today);
    // nextYear.setFullYear(today.getFullYear() + 1);
    try {
        const updatedApp = await PartnerApplication.update({ approved: true },
            {
                where: {
                    partnerApplicationId: req.params.id
                }
            }
        );
        globalEmitter.emit('partnerApprovalUpdate');

        const pa = await PartnerApplication.findByPk(req.params.id);
        const user = await User.findByPk(pa.userId);

        const userNotifications = await Notification.findAll({where: {userId: user.userId}});
        const userPANotification = userNotifications.filter((userNotifcation) => userNotifcation.content.toLowerCase().includes("partner application"));
        const userPANotifcationId = userPANotification[0].dataValues.notificationId;

        const deletedUserPANotification = await Notification.findByPk(userPANotifcationId);

        await deletedUserPANotification.destroy();

        req.body = {
            "content": `You have successfully approved ${user.userName}'s Partner Application`,
            "isRecent": false,
            "isPending": false,
            "isCompleted": true,
            "hasRead": false,
            "adminId": pa.adminId
        };

        await Notification.create(req.body);

        req.io.emit("newAcceptPartnerApplicationNotification", `Accepted Partner Application`);
        res.status(201).json(updatedApp);
    } catch(error) {
        console.error('Error updating PartnerApplication', error);
        res.status(500).send({error: 'Error updating PartnerApplication'});
    }
}

exports.rejectPartnerApplicationByID = async (req, res) => {
    console.log(req.body);
    const description = req.body.description;
    try {
        const updatedApp = await PartnerApplication.update({ adminNotes: description },
            {
                where: {
                    partnerApplicationId: req.params.id
                }
            }
        );

        const pa = await PartnerApplication.findByPk(req.params.id);
        const user = await User.findByPk(pa.userId);

        const userNotifications = await Notification.findAll({where: {userId: user.userId}});
        const userPANotification = userNotifications.filter((userNotifcation) => userNotifcation.content.toLowerCase().includes("partner application"));
        const userPANotifcationId = userPANotification[0].dataValues.notificationId;

        const deletedUserPANotification = await Notification.findByPk(userPANotifcationId);

        await deletedUserPANotification.destroy();

        req.body = {
            "content": `You have successfully rejected ${user.userName}'s Partner Application`,
            "isRecent": false,
            "isPending": false,
            "isCompleted": true,
            "hasRead": false,
            "adminId": pa.adminId
        };

        await Notification.create(req.body);
        req.io.emit("newRejectPartnerApplicationNotification", `Rejected Partner Application`);
        res.status(201).json(updatedApp);
    } catch(error) {
        console.error('Error updating PartnerApplication', error);
        res.status(500).send({error: 'Error updating PartnerApplication'});
    }
}

