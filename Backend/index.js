const express = require('express')
const app = express()

app.use(express.json())

const db = require('./models');
const userTestData = require('./test_data/userTestData');

// Routers
const postRouter = require('./routes/User')
const loginRoute = require('./routes/loginRoute')
const contactUsRouter = require('./routes/user/contactUsRoutes');
app.use("/user", postRouter, loginRoute, contactUsRouter)


db.sequelize.sync()
    .then(async () => {
        const existingRecordsCount = await db.User.count();

        if (existingRecordsCount === 0) {
            try {
                for (const data of userTestData) {
                    await db.User.create(data);
                }
                console.log('Test data inserted successfully.');
            } catch (error) {
                console.error('Error inserting test data:', error);
            }
        } else {
            console.log('Test data already exists in the database.');
        }

        db.sequelize.sync()
            .then(() => {
                app.listen(3000,'0.0.0.0', () => {
                    console.log('Server running on port 3000');
                });
            })
            .catch((error) => {
                console.error('Sequelize sync error:', error);
            });
    })
