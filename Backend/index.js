const express = require("express");
const cors = require("cors");
const app = express();

// model
const db = require("./models");
const userTestData = require("./test_data/userTestData");
const adminTestData = require("./test_data/adminTestData");

// testing purpose - remove before demo(?)
const faqTestData = require('./test_data/faqTestData');
const contactUsTestData = require('./test_data/contactUsTestData');

// admin routes
const authRouter = require('./routes/admin/authRoutes');
const adminRouter = require('./routes/admin/adminRoutes');
const faqRouter = require('./routes/admin/faqRoutes');
const contactUsAdminRouter = require('./routes/admin/contactUsRoutes');
const adminUserRouter = require('./routes/admin/userRoutes');

// const faqTestData = require("./test_data/faqTestData");
const transactionTestData = require("./test_data/transactionTestData");
const invoiceTestData = require("./test_data/invoiceTestData");
const propertyTestData = require("./test_data/propertyTestData");
const imageTestData = require("./test_data/imageTestData");
const reviewTestData = require("./test_data/reviewTestData");
const chatTestData = require("./test_data/chatTestData");
const requestTestData = require("./test_data/requestTestData");
const partnerApplicationId = require("./test_data/partnerApplicationTestData");

// admin routes
// const authRouter = require("./routes/admin/authRoutes");
// const adminRouter = require("./routes/admin/adminRoutes");
// const faqRouter = require("./routes/admin/faqRoutes");


// user routes
const userRoute = require("./routes/user/userRoute");
// const userRoute = require("./routes/user/User");
const loginRoute = require("./routes/user/loginRoute");
const documentRoute = require("./routes/user/documentRoute");
const folderRoute = require("./routes/user/folderRoute");
const transactionRoute = require("./routes/user/transactionRoute");
const contactUsUserRouter = require('./routes/user/contactUsRoutes');
const e = require("express");

app.use(cors());
app.use(express.json());

app.use('/admins', adminRouter);
app.use('/admin/auth', authRouter);
app.use('/admin/faqs', faqRouter);
app.use('/admin/contactUs', contactUsAdminRouter);
app.use('/admin/users', adminUserRouter);

app.use(
  "/user",
  userRoute,
  loginRoute,
  documentRoute,
  folderRoute,
  transactionRoute,
  contactUsUserRouter
);

db.sequelize
  .sync()
  .then(async () => {
    const existingUserRecordsCount = await db.User.count();
    const existingAdminRecordsCount = await db.Admin.count();
    const existingFaqRecordsCount = await db.FAQ.count();
    const existingTransactionRecordsCount = await db.Transaction.count();
    const existingInvoiceRecordsCount = await db.Invoice.count();
    const existingPropertyRecordsCount = await db.Property.count();
    const existingImageRecordsCount = await db.Image.count();
    const existingReviewRecordsCount = await db.Review.count();
    const existingChatRecordsCount = await db.Chat.count();
    const existingRequestRecordsCount = await db.Request.count();
    const existingContactUsRecordsCount = await db.ContactUs.count();
    const existingPartnerApplicationRecordsCount =
      await db.PartnerApplication.count();

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
            console.log('Contact Us test data inserted successfully.');
          } catch (error) {
            console.error('Error inserting Contact Us test data:', error);
          }
        } else {
          console.log('Contact Us test data already exists in the database.');
        }
    
        console.log('Faq test data inserted successfully.');
      } catch (error) {
        console.error('Error inserting Faq test data:', error);
      }
    } else {
      console.log('Admin test data already exists in the database.');
    }


        // Property
        if (existingPropertyRecordsCount === 0) {
          try {
            for (const propertyData of propertyTestData) {
              await db.Property.create(propertyData);
            }
            console.log("Property test data inserted successfully.");
          } catch (error) {
            console.log("Error inserting Property test data:", error);
          }
        } else {
          console.log("Property test data already exists in the database.");
        }

        // Images
        if (existingImageRecordsCount === 0) {
          try {
            for (const imageData of imageTestData) {
              await db.Image.create(imageData);
            }
            console.log("Image test data inserted successfully.");
          } catch (error) {
            console.log("Error inserting Image test data:", error);
          }
        } else {
          console.log("Image test data already exists in the database.");
        }

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

        // Invoice
        if (existingInvoiceRecordsCount === 0) {
          try {
            for (const invoiceData of invoiceTestData) {
              await db.Invoice.create(invoiceData);
            }
            console.log("Invoice test data inserted successfully.");
          } catch (error) {
            console.log("Error inserting Invoice test data:", error);
          }
        } else {
          console.log("Invoice test data already exists in the database.");
        }

        // Transaction
        if (existingTransactionRecordsCount === 0) {
          try {
            for (const transactionData of transactionTestData) {
              await db.Transaction.create(transactionData);
            }

            console.log("Transaction test data inserted successfully.");
          } catch (error) {
            console.error("Error inserting Transaction test data:", error);
          }
        } else {
          console.log("Transaction test data already exists in the database.");
        }

        app.listen(3000, () => {
          console.log("Server running on port 3000");
        });
      })
  .catch((error) => {
    console.error("Sequelize sync error:", error);
  });

