import 'mocha';
import * as request from 'supertest';
import CommonTests from '../../../common.tests';
import AuthServerController from '../../../../modules/users/controllers/auth.server.controller';
const mongoose = require('mongoose');
const expect = require('expect.js');

let _app, _agent, _conn, _auth, _ct;

describe('Users Module - Auth Controller', () => {
	before( (done) => {
		_auth = AuthServerController;
		done();
	});
	it('should have a method to register users', (done) => {
		expect(_auth.signup).to.be.ok();
		done();
	});
	it('should have a method to login users', (done) => {
		expect(_auth.signin).to.be.ok();
		done();
	});
	it('should have a method to logout users', (done) => {
		expect(_auth.signout).to.be.ok();
		done();
	});
});
