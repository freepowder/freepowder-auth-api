import 'mocha';
import * as request from 'supertest';
import CommonTests from '../../../common.tests';
import AdminServerController from '../../../../modules/users/controllers/admin.server.controller';
const mongoose = require('mongoose');
const expect = require('expect.js');

let _app, _agent, _conn, _admin, _ct;

describe('Users Module - Admin Controller', () => {

	before( (done) => {
		_admin = AdminServerController;
		done();

	});
	it('should have a method to get users', (done) => {
		expect(_admin.list).to.be.ok();
		done();
	});
	it('should have a method to get user', (done) => {
		expect(_admin.read).to.be.ok();
		done();
	});
	it('should have a method to update user', (done) => {
		expect(_admin.update).to.be.ok();
		done();
	});
	it('should have a method to delete user', (done) => {
		expect(_admin.delete).to.be.ok();
		done();
	});
});
