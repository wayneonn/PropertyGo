const express = require("express");
const http = require("http");
const socketIo = require("socket.io"); // for the event-based notification
const cors = require("cors");
const app = express();
const globalEmitter = require("./globalEmitter");
const WebSocket = require("ws");
const { loggedInUsers } = require('./shared');
require('dotenv').config();

const server = http.createServer(app);
// socket io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Allow connections from any origin
//     methods: ["GET", "POST"],
//   },
// });

// model
const db = require("./models");

// seed data
const userTestData = require("./test_data/userTestData");
const scheduleTestData = require("./test_data/scheduleTestData");
const viewingAvailabilityTestData = require("./test_data/viewingAvailabilityTestData");
const adminTestData = require("./test_data/adminTestData");
const faqTestData = require("./test_data/faqTestData");
const contactUsTestData = require("./test_data/contactUsTestData");
const responsesTestData = require("./test_data/responseTestData");
const transactionTestData = require("./test_data/transactionTestData");
// const invoiceTestData = require("./test_data/invoiceTestData");
const propertyTestData = require("./test_data/propertyTestData");
const imageTestData = require("./test_data/imageTestData");
const reviewTestData = require("./test_data/reviewTestData");
const chatTestData = require("./test_data/chatTestData");
const requestTestData = require("./test_data/requestTestData");
const partnerApplicationId = require("./test_data/partnerApplicationTestData");
const forumTopicTestData = require("./test_data/forumTopicTestData");
const forumPostTestData = require("./test_data/forumPostTestData");
const forumCommentTestData = require("./test_data/forumCommentTestData");
const notificationTestData = require("./test_data/notificationTestData");
const {createFakeTransactions, generateFakeProperties} = require("./test_data/fakerDataGenerator")

// admin routes
const authRouter = require("./routes/admin/authRoutes");
const adminRouter = require("./routes/admin/adminRoutes");
const faqRouter = require("./routes/admin/faqRoutes");
const contactUsAdminRouter = require("./routes/admin/contactUsRoutes");
const adminUserRouter = require("./routes/admin/userRoutes");
const responseRouter = require("./routes/admin/responseRoutes");
const forumTopicAdminRouter = require("./routes/admin/forumTopicRoutes");
const notificationAdminRouter = require("./routes/admin/notificationRoutes");
const propertyAdminRouter = require("./routes/admin/propertyRoutes");
const reviewAdminRouter = require("./routes/admin/reviewRoutes");
const folderAdminRouter = require("./routes/admin/folderRoutes");
const documentAdminRouter = require("./routes/admin/documentRoutes");
const transactionAdminRouter = require("./routes/admin/transactionRoutes");
const paymentAdminRouter = require("./routes/admin/paymentRoutes");
const forumPostAdminRouter = require("./routes/admin/forumPostRoutes");
const forumCommentAdminRouter = require("./routes/admin/forumCommentRoutes");

//property routes
const propertyRoute = require("./routes/user/propertyRoute");

// user routes
const userRoute = require("./routes/user/userRoute");
const imageRoute = require("./routes/user/imageRoute");
const loginRoute = require("./routes/user/loginRoute");
const documentRoute = require("./routes/user/documentRoute");
const folderRoute = require("./routes/user/folderRoute");
const transactionRoute = require("./routes/user/transactionRoute");
const contactUsUserRouter = require("./routes/user/contactUsRoutes");
const forumTopicUserRouter = require("./routes/user/forumTopicRoute");
const forumPostUserRouter = require("./routes/user/forumPostRoute");
const forumCommentUserRouter = require("./routes/user/forumCommentRoute");
const partnerApplicationUserRouter = require("./routes/user/partnerApplicationRoute");
const reviewRoute = require("./routes/user/reviewRoute");
const faqRoute = require("./routes/user/faqRoute");
const notificationRoute = require("./routes/user/notificationRoute");
const responseRoute = require("./routes/user/responseRoute");
const scheduleRoute = require("./routes/user/scheduleRoute");
const viewingAvailabilityRoute = require("./routes/user/viewingAvailabilityRoute");
const stripeRoute = require("./routes/user/stripeRoute");
const e = require("express");

app.use(cors());
app.use(express.json());

const injectIo = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

app.use("/admins", adminRouter);
app.use("/admin/auth", authRouter);
app.use("/admin/faqs", injectIo(io), faqRouter);
app.use("/admin/users", adminUserRouter);
app.use("/admin/contactUs", injectIo(io), contactUsAdminRouter);
app.use("/admin/contactUs/:id/responses",injectIo(io), responseRouter);
app.use("/admin/forumTopics", injectIo(io), forumTopicAdminRouter);
app.use("/admin/notifications", notificationAdminRouter);
app.use("/admin/properties", propertyAdminRouter);
app.use("/admin/reviews", reviewAdminRouter);
app.use("/admin/documents", documentAdminRouter);
app.use("/admin/folders", folderAdminRouter);
app.use("/admin/transactions", transactionAdminRouter);
app.use("/admin/payments", paymentAdminRouter);
app.use("/admin/forumPosts", injectIo(io), forumPostAdminRouter);
app.use("/admin/forumComments", injectIo(io), forumCommentAdminRouter);

app.use(
  "/user",
  injectIo(io),
  userRoute,
  loginRoute,
  documentRoute,
  folderRoute,
  transactionRoute,
  contactUsUserRouter,
  forumTopicUserRouter,
  forumPostUserRouter,
  forumCommentUserRouter,
  partnerApplicationUserRouter,
  faqRoute,
  notificationRoute,
  responseRoute,
  stripeRoute
);

io.on("connection", (socket) => {

  console.log(`Client connected: ${socket.id}`);

  socket.on('login', (userId) => {

    loggedInUsers.set(userId, socket.id);
    console.log("socketID: ",socket.id)
    // socket.emit('login', userId)
    console.log(`User with userId ${userId} has logged in.`);
    // console.log("Login: ", socket.userId);
  });

  socket.on('logout', (userId) => {
    // Access the userId from the socket object
    console.log("Logout: ", loggedInUsers.get(userId))
    // socket.to(loggedInUsers.get(userId)).emit('logout', userId)
    loggedInUsers.delete(userId);
    console.log(`User with userId ${userId} has logged out.`);
  });
  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use("/property", propertyRoute);

app.use(
  "/schedule",
  injectIo(io),
  scheduleRoute,
);

app.use(
  "/viewingAvailability",
  viewingAvailabilityRoute,
);

app.use(
  "/image",
  imageRoute,
);

app.use(
  "/review",
  reviewRoute,
);

app.use("/review", reviewRoute);

// TRYING TO USE WEBSOCKETS.
// const wss = new WebSocket.Server({server})

globalEmitter.on("newUserCreated", async (user) => {
  await db.Folder.create({
    userId: user.userId,
    timestamp: Date.now(),
    title: "Default",
  });
});

globalEmitter.on("partnerApprovalUpdate", async () => {
  console.log("Received partner approval update notice.");
});
//
// globalEmitter.on('partnerCreated', async() => {
//     console.log("========================== Partner created =============================");
//     wss.clients.forEach((client) => {
//
//         client.send("partnerCreated");
//     });
// })

db.sequelize
  .sync()
  .then(async () => {
    const existingUserRecordsCount = await db.User.count();
    const existingAdminRecordsCount = await db.Admin.count();
    const existingFaqRecordsCount = await db.FAQ.count();
    const existingTransactionRecordsCount = await db.Transaction.count();
    const existingScheduleRecordsCount = await db.Schedule.count();
    const existingViewingAvailabilityCount = await db.ViewingAvailability.count();
    // const existingInvoiceRecordsCount = await db.Invoice.count();
    const existingPropertyRecordsCount = await db.Property.count();
    const existingImageRecordsCount = await db.Image.count();
    const existingReviewRecordsCount = await db.Review.count();
    const existingChatRecordsCount = await db.Chat.count();
    const existingRequestRecordsCount = await db.Request.count();
    const existingContactUsRecordsCount = await db.ContactUs.count();
    const existingPartnerApplicationRecordsCount =
      await db.PartnerApplication.count();
    const existingForumTopicRecordsCount = await db.ForumTopic.count();
    const existingForumPostRecordsCount = await db.ForumPost.count();
    const existingForumCommentRecordsCount = await db.ForumComment.count();
    const existingResponseRecordsCount = await db.Response.count();
    const existingNotificationRecordsCount = await db.Notification.count();

    // General order of data insertion:
    // User -> Admin -> FAQ -> Property -> Image -> Chat -> Transaction -> Invoice -> Review

    // User
    if (existingUserRecordsCount === 0) {
      try {
        for (const userData of userTestData) {
          await db.User.create(userData);
        }
        console.log("User test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting user test data:", error);
      }
    } else {
      console.log("User test data already exists in the database.");
    }

    // Admin
    if (existingAdminRecordsCount === 0) {
      try {
        for (const adminData of adminTestData) {
          await db.Admin.create(adminData);
        }
        console.log("Admin test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Admin test data:", error);
      }
    } else {
      console.log("Admin test data already exists in the database.");
    }

    // Partner Application
    if (existingPartnerApplicationRecordsCount === 0) {
      try {
        for (const partnerApplicationData of partnerApplicationId) {
          await db.PartnerApplication.create(partnerApplicationData);
        }
        console.log("Partner Application test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Partner Application test data:", error);
      }
    } else {
      console.log(
        "Partner Application test data already exists in the database."
      );
    }

    if (existingContactUsRecordsCount === 0) {
      try {
        for (const contactUsData of contactUsTestData) {
          await db.ContactUs.create(contactUsData);
        }
        console.log("Contact Us test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Contact Us test data:", error);
      }
    } else {
      console.log("Contact Us test data already exists in the database.");
    }

    if (existingResponseRecordsCount === 0) {
      try {
        for (const responseData of responsesTestData) {
          await db.Response.create(responseData);
        }
        console.log("Response test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Response test data:", error);
      }
    } else {
      console.log("Response test data already exists in the database.");
    }

    // Property
    if (existingPropertyRecordsCount === 0) {
      try {
        for (const propertyData of propertyTestData) {
          await db.Property.create(propertyData);
        }
        const fake_prop = await generateFakeProperties(1000)
        console.log("Property test data inserted successfully.");
      } catch (error) {
        console.log("Error inserting Property test data:", error);
      }
    } else {
      console.log("Property test data already exists in the database.");
    }

    if (existingScheduleRecordsCount === 0) {
      try {
        for (const scheduleData of scheduleTestData) {
          await db.Schedule.create(scheduleData);
        }
        console.log("Schedule test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Schedule test data:", error);
      }
    } else {
      console.log("Schedule test data already exists in the database.");
    }

    if (existingViewingAvailabilityCount === 0) {
      try {
        for (const viewingAvailability of viewingAvailabilityTestData) {
          await db.ViewingAvailability.create(viewingAvailability);
        }
        console.log("Viewing Availability test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Viewing Availability test data:", error);
      }
    } else {
      console.log("Viewing Availability test data already exists in the database.");
    }

    // Images
    // if (existingImageRecordsCount === 0) {
    //   try {
    //     for (const imageData of imageTestData) {
    //       await db.Image.create(imageData);
    //     }
    //     console.log("Image test data inserted successfully.");
    //   } catch (error) {
    //     console.log("Error inserting Image test data:", error);
    //   }
    // } else {
    //   console.log("Image test data already exists in the database.");
    // }

    // Chats
    if (existingChatRecordsCount === 0) {
      try {
        for (const chatData of chatTestData) {
          await db.Chat.create(chatData);
        }
        console.log("Chat test data inserted successfully.");
      } catch (error) {
        console.log("Error inserting Chat test data:", error);
      }
    } else {
      console.log("Chat test data already exists in the database.");
    }

    // Requests
    if (existingRequestRecordsCount === 0) {
      try {
        for (const requestData of requestTestData) {
          await db.Request.create(requestData);
        }
        console.log("Request test data inserted successfully.");
      } catch (error) {
        console.log("Error inserting Request test data:", error);
      }
    } else {
      console.log("Request test data already exists in the database.");
    }

    // Review
    if (existingReviewRecordsCount === 0) {
      try {
        for (const reviewData of reviewTestData) {
          await db.Review.create(reviewData);
        }
        console.log("Review test data inserted successfully.");
      } catch (error) {
        console.log("Error inserting Review test data:", error);
      }
    } else {
      console.log("Review test data already exists in the database.");
    }

    // // Invoice
    // if (existingInvoiceRecordsCount === 0) {
    //   try {
    //     for (const invoiceData of invoiceTestData) {
    //       await db.Invoice.create(invoiceData);
    //     }
    //     console.log("Invoice test data inserted successfully.");
    //   } catch (error) {
    //     console.log("Error inserting Invoice test data:", error);
    //   }
    // } else {
    //   console.log("Invoice test data already exists in the database.");
    // }

    // Transaction
    if (existingTransactionRecordsCount === 0) {
      try {
        for (const transactionData of transactionTestData) {
          await db.Transaction.create(transactionData);
        }
        console.log("Transaction data inserted successfully.");
        const genData = await createFakeTransactions(1000);
      } catch (error) {
        console.log("Error inserting transaction data: ", error);
      }
    } else {
      console.log("Transaction data already exists. ");
    }

    // Partner Application
    if (existingPartnerApplicationRecordsCount === 0) {
      try {
        for (const partnerApplicationData of partnerApplicationId) {
          await db.PartnerApplication.create(partnerApplicationData);
        }
        console.log("Partner Application test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Partner Application test data:", error);
      }
    } else {
      console.log(
        "Partner Application test data already exists in the database."
      );
    }

    // FAQ
    if (existingFaqRecordsCount === 0) {
      try {
        for (const faqData of faqTestData) {
          await db.FAQ.create(faqData);
        }

        if (existingContactUsRecordsCount === 0) {
          try {
            for (const contactUsData of contactUsTestData) {
              await db.ContactUs.create(contactUsData);
            }
            console.log("Contact Us test data inserted successfully.");
          } catch (error) {
            console.error("Error inserting Contact Us test data:", error);
          }
        } else {
          console.log("Contact Us test data already exists in the database.");
        }

        console.log("Faq test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting Faq test data:", error);
      }
    } else {
      console.log("Admin test data already exists in the database.");
    }

    // Images
    // if (existingImageRecordsCount === 0) {
    //   try {
    //     for (const imageData of imageTestData) {
    //       await db.Image.create(imageData);
    //     }
    //     console.log("Image test data inserted successfully.");
    //   } catch (error) {
    //     console.log("Error inserting Image test data:", error);
    //   }
    // } else {
    //   console.log("Image test data already exists in the database.");
    // }

    // Review

    // Transaction
    // if (existingTransactionRecordsCount === 0) {
    //   try {
    //     for (const transactionData of transactionTestData) {
    //       await db.Transaction.create(transactionData);
    //     }

    //     console.log("Transaction test data inserted successfully.");
    //   } catch (error) {
    //     console.error("Error inserting Transaction test data:", error);
    //   }
    // } else {
    //   console.log("Transaction test data already exists in the database.");
    // }

    // ForumTopic
    if (existingForumTopicRecordsCount === 0) {
      try {
        for (const forumTopicData of forumTopicTestData) {
          await db.ForumTopic.create(forumTopicData);
        }

        console.log("ForumTopic test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting ForumTopic test data:", error);
      }
    } else {
      console.log("ForumTopic test data already exists in the database.");
    }

    // ForumPost
    if (existingForumPostRecordsCount === 0) {
      try {
        for (const forumPostData of forumPostTestData) {
          await db.ForumPost.create(forumPostData);
        }

        console.log("ForumPost test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting ForumPost test data:", error);
      }
    } else {
      console.log("ForumPost test data already exists in the database.");
    }

    // ForumComment
    if (existingForumCommentRecordsCount === 0) {
      try {
        for (const forumCommentData of forumCommentTestData) {
          await db.ForumComment.create(forumCommentData);
        }

        console.log("ForumComment test data inserted successfully.");
      } catch (error) {
        console.error("Error inserting ForumComment test data:", error);
      }
    } else {
      console.log("ForumComment test data already exists in the database.");
    }

    // if (existingNotificationRecordsCount === 0) {
    //   try {
    //     for (const notificationData of notificationTestData) {
    //       await db.Notification.create(notificationData);
    //     }

    //     console.log("Notification test data inserted successfully.");
    //   } catch (error) {
    //     console.error("Error inserting Notification test data:", error);
    //   }
    // } else {
    //   console.log("Notification test data already exists in the database.");
    // }

    // app.listen(3000, () => {
    //   console.log("Server running on port 3000");
    // });

    //   server.listen(3000, () => {
    //     console.log("io server running on port 3000");
    //   })
    // })

    server.listen(3000, () => {
      console.log("Server started on http://localhost:3000/");
    });
  })
  .catch((error) => {
    console.error("Sequelize sync error:", error);
  });
