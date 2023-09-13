const express = require('express');
const cors = require('cors');
const app = express();

// model
const db = require('./models');
const userTestData = require('./test_data/userTestData');
const adminTestData = require('./test_data/adminTestData');

// admin routes
const adminAuthentication = require('./routes/admin/authentication');

// user routes
const postRouter = require('./routes/user/User')
const loginRoute = require('./routes/user/loginRoute');

app.use(cors());
app.use(express.json());

app.use('/admin/auth', adminAuthentication);

app.use("/user", postRouter, loginRoute);


db.sequelize.sync()
    .then(async () => {
        const existingUserRecordsCount = await db.User.count();
        const exisitngAdminRecordsCount = await db.Admin.count();

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

        if (exisitngAdminRecordsCount === 0) {
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

        // db.sequelize.sync({ force: true })
        //     .then(() => {
        //         app.listen(3000, () => {
        //             console.log('Server running on port 3000');
        //         });
        //     })
        //     .catch((error) => {
        //         console.error('Sequelize sync error:', error);
        //     });
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Sequelize sync error:', error);
    })
