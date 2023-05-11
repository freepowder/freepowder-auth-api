
import * as mongoose from 'mongoose';
import * as validator from 'validator';

const validateLocalStrategyEmail = (email) => {
	// @ts-ignore
	return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String,
		index: true,
		unique: true,
		lowercase: true,
		trim: true,
		default: '',
		validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user'],
		required: 'Please provide at least one role'
	},
	password: {
		type: String,
		default: ''
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});
export default mongoose.model( 'User', UserSchema, 'users');
