const express = require('express');
const cors = require("cors");
require('./db/sequelize')
const corsOptions = {
    origin: "http://localhost:3000"
}
const app = express();

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

const userRouter = require('./router/user');

app.use(userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})