//jshint esversion:6
const auth = require('./middlewares/auth');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config()
const db_psw = process.env.MONGO_PASSWORD;


const MONGO_URL = `mongodb+srv://melendez:${db_psw}@cluster0-m0t4i.mongodb.net/fios?retryWrites=true`;
//main app
const app = express();
app.use(cors());

app.use(helmet());
//storing sessions
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});
// setting sessions
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//flash messages
app.use(flash());

// set views engine 
app.set('view engine', 'ejs');
app.set('views', 'views');
//midlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// setting routes
const homeRoutes = require('./routes/home');
const reportRoutes = require('./routes/reports');
const referralRoutes = require('./routes/referrals');
const refereeRoutes = require('./routes/referee');
const usersRoutes = require('./routes/users');
const managersRoutes = require('./routes/managers');



app.use(homeRoutes);
app.use(reportRoutes);
app.use(referralRoutes);
app.use('/referee', refereeRoutes);
app.use('/user', usersRoutes);
app.use('/manager', managersRoutes);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true
  })
  .then(result => {
    let PORT = process.env.PORT || 3000;
    app.listen(PORT);
    console.log('Server started and DB Connected');
  })
  .catch(err => {
    console.log(err.message);
  });