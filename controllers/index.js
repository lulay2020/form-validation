const User = require('../models/user');
const bcrypt = require('bcryptjs');
const util = require('util');
const passport = require('passport');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
 	postRegister(req, res, next) {
	  	const { name, email, password, password2 } = req.body;
	  	let errors = [];

		// Check required feilds
		if(!name || !email || !password || !password2){
			errors.push({ msg: 'Please fill in all fields'});
		}

  		// Check passwords match
  		if(password !== password){
   			errors.push({ msg: 'Passwords do not match' });
  		}

  		// Check pass length
  		if(password.length < 6){
   			errors.push({ msg: 'Password should be at least 6 characters'});
  		}

  		if(errors.length > 0){
   			res.render('index', {
    			errors,
    			name,
    			email,
   			});
  		} else {
   		// Validation passed
   		User.findOne({ email: email })
   		.then(user => {
    		if(user){
     			errors.push({ msg: 'Email is already registered' });
     			res.render('index', {
      				errors,
      				name,
      				email,
     			});
    		} else {
     			const newUser = new User({
      				name,
      				email,
      				password
     			});

     			// Hash password
     			bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
      				if(err) throw err;

      				newUser.password = hash;
      				newUser.save()
      			.then(user => {
       				req.flash('success_msg', 'You are now registered, please login');
       				res.redirect('/');
      			})
      			.catch(err => console.log(err));
     			}))
    		}
   		});
  	}
},

  postLogin(req, res, next)  {
    	passport.authenticate('local', {
     		successRedirect: '/dashboard',
     		failureRedirect: '/',
     		failureFlash: true
    	})(req, res, next);
  },

  getForgotPw(req, res, next) {
    	res.render('forgot');
  },

  async putForgotPw(req, res, next){
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'No account with that email exists.');
      return res.redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const msg = {
    	to: email,
      from: 'Admin <luluboo2020@gmail.com>',
      subject: 'Form Validation- Forgot Password / Reset',
      text: `You are receiving this because you (or someone else)
      have requested the reset of the password for your account.
      Please click on the following link,
      or copy and paste it into your browser to complete the process:
      http://${req.headers.host}/reset/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/    /g, ''),
    };
    await sgMail.send(msg);
    req.flash('success_msg', `An email has been sent to ${email} with further instructions`);
    res.redirect('/forgot-password');
  },

  async getReset(req, res, next){
      const { token } = req.params;
      const user = await User.findOne({
        	resetPasswordToken: token,
        	resetPasswordExpires :{ $gt: Date.now() }
      });

      if (!user) {
        	req.flash('error_msg', 'Password reset token is invalid or has expired');
        	return res.redirect('/forgot-password');
      }
      res.render('reset', { token });
  },

  async putReset(req, res, next){
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires :{ $gt: Date.now() }
    });

    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot-password');
    }

    if (req.body.password === req.body.password2) {
      // Hash password
      bcrypt.genSalt(10, (err, salt) => bcrypt.hash(req.body.password, salt, (err, hash) =>{
        if(err) throw err;
          // store the hash in DB
          user.password = hash;
          // set token and token expiration to null
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          user.save()
          // login user
          const login = util.promisify(req.login.bind(req));
          login(user);
          // send password changed message to the user 
          const msg = {
            to: user.email,
            from: 'Admin <luluboo2020@gmail.com>',
            subject: 'Form Validation - Password Changed',
            text: `Hello,
            This email is to confirm that the password for your account has just been changed.
            If you did not make this change, please hit reply and notify us at once.`.replace(/            /g, '')
            };
          sgMail.send(msg);
          // redirect with a flash message
          req.flash('success_msg', 'Password successfully changed, Welcome back !');
          res.redirect('/dashboard');
        }))
    } else {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect(`/reset/${ token }`);
    }
  },

  getLogout(req, res, next){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  }
}