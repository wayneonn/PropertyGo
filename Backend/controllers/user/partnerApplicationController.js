const {PartnerApplication, Folder, User, Notification} = require("../../models")
const globalEmitter = require('../../globalEmitter')
const {updateAdminPassword} = require("../admin/adminController");
const nodemailer = require("nodemailer")

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'jzhongzhi@gmail.com',
        clientId: '842279693113-fnnvu6fh818atmjea5a0unoqp7d1v46n.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04GOygHNHBBFVCgYIARAAGAQSNgF-L9IrM-SfuftJl9hpyMKZsDXbuHZ1JFBV46kVkBnJYYFBSNWzERBkGjMOIvj1UvqrcmlUFg',
        accessToken: 'ya29.a0AfB_byAlcFnc29QM-5wMqnBQe510Gub2hY0TrOngMcFsJiO7pIMWNo0jeOGqSRjHoq68g0Qnxf8A0vpL-QYbe1en5is5qGEhgA2R0xyU7JH9UhQnekcHWu6NuW3ZYDzXQNuaSva6vukR1bR9gnbl_fqrtznJqlENHbDzaCgYKAaASARISFQGOcNnCcOavpuzvT3ettveX1XxzKQ0171' // this is optional and can be left out. The library will automatically request a new access token if it's missing or expired.
    }
});


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
        const applyingUser = await User.findOne({
            where: {
                userId: userId
            }
        })
        const mailOptions = {
            from: 'jzhongzhi@gmail.com',
            to: applyingUser.email,
            subject: `PropertyGo: You applied to be a ${userRole}!`,
            html: `<div style="background-color: #f7f9fc; padding: 30px; font-family: Arial, sans-serif; border-radius: 8px; width: 600px; margin: auto;">
                        <h2 style="color: #2c3e50; font-weight: bold; border-bottom: 2px solid #e74c3c; display: inline-block; padding-bottom: 10px;">Hello ${applyingUser.userName},</h2>
                        <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5; margin-top: 20px;">
                            Welcome to <span style="font-weight: bold; color: #e74c3c;">PropertyGo</span>! We're thrilled to inform you that we have received your application to be a partner.
                        </p>
                        <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                            Please be patient while we process your application. We'll be in touch soon!.
                        </p>
                    </div>`
        };
        await smtpTransport.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', response);
            }
        });
        globalEmitter.emit("partnerCreated");
        res.status(201).json(newPartnerApplication);
    } catch (error) {
        console.error('Error creating PartnerApplication', error);
        res.status(500).send({error: 'Error creating PartnerApplication'});
    }
};

// Also need to update user data ---> Done.
// Done NodeMailer.
exports.updatePartnerApplicationByID = async (req, res) => {
    // console.log(req.body);
    try {
        const updatedApp = await PartnerApplication.update({approved: true},
            {
                where: {
                    partnerApplicationId: req.params.id
                }
            }
        );
        if (updatedApp[0] === 1) {
            console.log("Approved partner application from: ", updatedApp);
            try {
                const partnerAppUpdated = await PartnerApplication.findOne({
                    where: {
                        partnerApplicationId: req.params.id
                    }
                })
                console.log("This is the updated PartnerApp: ", partnerAppUpdated.dataValues)
                const userId = partnerAppUpdated.dataValues.userId
                const userType = partnerAppUpdated.dataValues.userRole
                const companyName = partnerAppUpdated.dataValues.companyName
                console.log(`This is the: ${userType} ${userId} ${companyName}`)
                const updatedUser = await User.update({
                    userType: userType,
                    companyName: companyName
                }, {
                    where: {
                        userId: userId
                    }
                })
                console.log("This is the updated User status: ", updatedUser)
                const updatedUser2 = await User.findOne({
                    where: {
                        userId: userId
                    }
                })
                const email = updatedUser2.email
                const mailOptions = {
                    from: 'jzhongzhi@gmail.com',
                    to: email,
                    subject: `Your application to be a ${userType}!`,
                    html: '<div style="font-family: Arial, sans-serif; background-color: #e9f7fa; padding: 20px; border-radius: 5px; max-width: 600px; margin: auto;">\n' +
                        '    <h2 style="color: #2c3e50; font-size: 20px; border-bottom: 2px solid #3498db; display: inline-block; padding-bottom: 10px; margin-top: 0;">\n' +
                        '        Hello,\n' +
                        '    </h2>\n' +
                        '    <p style="color: #34495e; font-size: 16px; line-height: 1.5; margin-top: 20px;">\n' +
                        '        This is an email from <strong style="color: #3498db;">PropertyGo</strong>! We have <span style="color: #27ae60; font-weight: bold;">approved</span> your application to be a partner!\n' +
                        '    </p>\n' +
                        '</div>'
                };
                await smtpTransport.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        console.log('Email sent:', response);
                    }
                });

            } catch (error) {
                console.error('Error updating User from PartnerApplication', error)
                res.status(500).send({error: 'Error updating User from PartnerApplication'})
            }

        }
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
    } catch (error) {
        console.error('Error updating PartnerApplication', error);
        res.status(500).send({error: 'Error updating PartnerApplication'});
    }
}

exports.rejectPartnerApplicationByID = async (req, res) => {
    console.log(req.body);
    const description = req.body.description;
    try {
        const updatedApp = await PartnerApplication.update({adminNotes: description, approved: false},
            {
                where: {
                    partnerApplicationId: req.params.id
                }
            }
        );

        if (updatedApp[0] === 1) {
            console.log("Rejected partner application: ", updatedApp);
            try {
                const partnerAppUpdated = await PartnerApplication.findOne({
                    where: {
                        partnerApplicationId: req.params.id
                    }
                })
                console.log("This is the rejected PartnerApp: ", partnerAppUpdated.dataValues)
                const userId = partnerAppUpdated.dataValues.userId
                const userType = partnerAppUpdated.dataValues.userRole
                const updatedUser = await User.findOne({
                    where: {
                        userId: userId
                    }
                })
                const email = updatedUser.email
                const mailOptions = {
                    from: 'jzhongzhi@gmail.com',
                    to: email,
                    subject: `Your application to be a ${userType}!`,
                    html: `<div style="font-family: Arial, sans-serif; background-color: #ffebee; padding: 20px; border-radius: 5px; max-width: 600px; margin: auto;">
                                <h2 style="color: #c0392b; font-size: 20px; border-bottom: 2px solid #e74c3c; display: inline-block; padding-bottom: 10px; margin-top: 0;">
                                    Hello,
                                </h2>
                                <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5; margin-top: 20px;">
                                    This is an email from <strong style="color: #e74c3c;">PropertyGo</strong>! Unfortunately, we have <span style="color: #c0392b; font-weight: bold;">rejected</span> your application to be a partner.
                                </p>
                                <p style="color: #34495e; font-size: 16px; line-height: 1.5; margin-top: 10px;">
                                    This is the reason why we rejected you: <em style="color: #c0392b;">${description}</em>
                                </p>
                            </div>`,
                };
                await smtpTransport.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        console.log('Email sent:', response);
                    }
                });
            } catch (error) {
                console.error('Error sending PartnerApplication rejection email.', error);
                res.status(500).send({error: 'Error updating PartnerApplication'});
            }
        }
        globalEmitter.emit('partnerRejectionUpdate');

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
    } catch (error) {
        console.error('Error updating PartnerApplication', error);
        res.status(500).send({error: 'Error updating PartnerApplication'});
    }
}

