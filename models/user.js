const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	password: {
		type: String,
	},

	date: {
		type: Date,
		default: Date.now
	},

	google_id: String,
	linkedin_id: String,
	facebook_id: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

const User = mongoose.model('User', UserSchema);

module.exports = User;