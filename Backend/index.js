const express = require('express')
const app = express()

app.use(express.json())

const db = require('./models')

// Routers
const postRouter = require('./routes/Users')
app.use("/users", postRouter)

db.sequelize.sync().then(() => {

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    });
});
