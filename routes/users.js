const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {	
	postLogin,
	postRegister,
	getForgotPw,
	putForgotPw,
	getReset,
	putReset,
	getLogout,
} = require('../controllers');

//post login
router.post('/login', postLogin)

// POST /register
router.post('/register', postRegister)

/* GET /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
router.put('/forgot-password', putForgotPw);

/* GET /reset/:token */
router.get('/reset/:token', getReset);

/* PUT /reset/:token */
router.put('/reset/:token', putReset);

// GET /logout
router.get('/logout', getLogout);

// GET /auth/google
router.get('/auth/google',
  passport.authenticate('google', { scope: 
  	['profile', 'email'] }));

// GET /auth/google/callback
router.get('/auth/google/callback', 
  	passport.authenticate('google', { failureRedirect: '/' }),
  	function(req, res) {
    	res.redirect('/dashboard');
  	}
);

// GET /auth/facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// GET /auth/facebook/callback 
router.get('/auth/facebook/callback',
  	passport.authenticate('facebook', { 
  		successRedirect: '/dashboard',
        failureRedirect: '/' 
    })
);
module.exports = router;