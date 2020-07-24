const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Passport config
require('./config/passport')(passport);

// Passport-google config
require('./config/google-auth')(passport);

// Passport-facebook config
require('./config/facebook-auth')(passport);

// DB config
const db = process.env.MONGO_URI;

mongoose.connect(db, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Method Override
app.use(methodOverride('_method'));

// EJS 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Serve Favicon
app.use(favicon(path.join(__dirname, 'public', 'images/form.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next)=> {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));

// set public assets directory
app.use(express.static('public'));


const port = process.env.PORT || 3000;

app.listen(port, console.log(`Listening on port ${port}`));