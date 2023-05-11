import 'mocha';
import UserServerController from '../../../../modules/users/controllers/user.server.controller';
const expect = require('expect.js');

let  _users;

describe('Users Module - User Controller', () => {
	before( (done) => {
		// Get application
			_users = UserServerController;
			done();
	});
	it('should have a method to get user', (done) => {
		expect(_users.me).to.be.ok();
		done();
	});
	it('should have a method to update user', (done) => {
		expect(_users.update).to.be.ok();
		done();
	});
	it('should have a method to change user password', (done) => {
		expect(_users.changePassword).to.be.ok();
		done();
	});
});
