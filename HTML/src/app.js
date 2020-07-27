const express = require('express')
const app = express('')
const morgan = require('morgan')
const path = require('path')
const mongoose= require('mongoose')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const engine = require('ejs-mate');

mongoose.connect('mongodb://localhost/cruds').then(db => console.log(`db mongo connected ${db}`)).catch(err => console.log(err))


// initializations

require('./database');
require('./passport/local-auth');


// settings
app.set('port',process.env.PORT || 3000)
app.set('views',path.join(__dirname,'views'))
app.engine('ejs', engine);
app.set('view engine','ejs')

// middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());


  app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    console.log(app.locals)
    next();
  });


// routes
app.use('/', require('./routes/index'));

// Starting the server
app.listen(app.get('port'),()=>
{console.log(`Server connect port ${app.get('port')}`)})