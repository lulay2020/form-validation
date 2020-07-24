const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');


module.exports = function (passport){
	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL: "https://form-validation101.herokuapp.com/auth/facebook/callback"
		},

		function(accessToken, refreshToken, profile, done) {
			//check user table for anyone with a facebook ID of profile.id
			console.log(profile);
		    User.findOne({
		        'facebook_id': profile.id 
		    }, function(err, user) {
		        if (err) {
		            return done(err);
		        }
		        //No user was found... so create a new user with values from facebook (all the profile. stuff)
		        if (!user) {
		            user = new User({
		                name: profile.displayName,
		                provider: 'facebook',
		                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
		                facebook_id: profile.id
		            });
		            user.save(function(err) {
		                if (err) console.log(err);
		                return done(err, user);
		            });
		        } else {
		            //found user. Return
		            return done(err, user);
		        }
		    });
		}
	));
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});	
}