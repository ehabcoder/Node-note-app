const express = require('express');
const path = require('path');
// const cors = require("cors");
require('./db/sequelize');
// const corsOptions = {
//     origin: "http://localhost:3000"
// }
const app = express();

// app.use(cors(corsOptions))

//Loads the handlebars module
const { engine } = require('express-handlebars');
//Sets the app to use handlebars engine
app.engine('hbs', engine({
    defaultLayout: 'index',
    extname: 'hbs',
    partialsDir: `${__dirname}/views/partials`
    }));
app.set('view engine', 'hbs');
//Sets up handlebars configurations
app.set('views', `${__dirname}/views`)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const userRouter = require('./router/user');
const noteRouter = require('./router/note');

app.use(userRouter);
app.use(noteRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})