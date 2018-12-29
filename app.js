const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const passport = require('passport');

// passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo DB
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('MongoDB Connected'))
    .catch(err=>console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Bodyparser
app.use(express.urlencoded({extended:false}));

// Express session 
app.use(session({
    secret:'mysceret',
    resave:true,
    saveUninitialized:true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req,res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server running on ${PORT}`));