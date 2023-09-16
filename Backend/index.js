const express = require('express');
const cors = require('cors');
const app = express();

// model
const db = require('./models');
const userTestData = require('./test_data/userTestData');
const adminTestData = require('./test_data/adminTestData');

// testing purpose - remove before demo(?)
const faqTestData = require('./test_data/faqTestData');

// admin routes
const authRouter = require('./routes/admin/authRoutes');
const adminRouter = require('./routes/admin/adminRoutes');
const faqRouter = require('./routes/admin/faqRoutes');

// user routes
const postRouter = require('./routes/user/User')
const loginRoute = require('./routes/user/loginRoute');

app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/admin/auth', authRouter);
app.use('/admin/faqs', faqRouter);

app.use("/user", postRouter, loginRoute);


db.sequelize.sync()
    .then(async () => {
        const existingUserRecordsCount = await db.User.count();
        const existingAdminRecordsCount = await db.Admin.count();
        const existingFaqRecordsCount = await db.FAQ.count();

        if (existingUserRecordsCount === 0) {
            try {
                for (const userData of userTestData) {
                    await db.User.create(userData);
                }

                console.log('User test data inserted successfully.');
            } catch (error) {
                console.error('Error inserting user test data:', error);
            }
        } else {
            console.log('User test data already exists in the database.');
        }

        if (existingAdminRecordsCount === 0) {
            try {
                for (const adminData of adminTestData) {
                    await db.Admin.create(adminData);
                }

                console.log('Admin test data inserted successfully.');
            } catch (error) {
                console.error('Error inserting Admin test data:', error);
            }
        } else {
            console.log('Admin test data already exists in the database.');
        }

        if (existingFaqRecordsCount === 0) {
            try {
                for (const faqData of faqTestData) {
                    await db.FAQ.create(faqData);
                }

                console.log('Faq test data inserted successfully.');
            } catch (error) {
                console.error('Error inserting Faq test data:', error);
            }
        } else {
            console.log('Admin test data already exists in the database.');
        }

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Sequelize sync error:', error);
    })
