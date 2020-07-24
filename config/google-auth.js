const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');


module.exports = function (passport){
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "http://localhost:3000/auth/google/callback"
		},

		function(accessToken, refreshToken, profile, done) {
			//check user table for anyone with a facebook ID of profile.id
			console.log(profile, profile.id);
		    User.findOne({
		        'google_id': profile.id 
		    }, function(err, user) {
		        if (err) {
		            return done(err);
		        }
		        //No user was found... so create a new user with values from google (all the profile. stuff)
		        if (!user) {
		            user = new User({
		                name: profile.displayName,
		                email: profile.emails[0].value,
		                provider: 'google',
		                //now in the future searching on User.findOne({'google.id': profile.id } will match because of this next line
		                google_id: profile.id
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
