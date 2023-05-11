import * as mocha from 'mocha';
const request = require('supertest');
import CommonTests from '../../../common.tests';
import AuthServerController from '../../../../modules/users/controllers/auth.server.controller';
const mongoose = require('mongoose');
const expect = require('expect.js');
import User from '../../../../modules/users/model/user.model';

let _app, _agent, _conn, _auth, _ct, _credentialsEmail, _user, _testUser;



const createUser = (): Promise<any> => {

	_user = {
		email: _credentialsEmail.email,
		password: _credentialsEmail.password,
		provider: 'local',
	};
	_testUser = new User(_user);
	_testUser['roles'] = ['user'];
	return _testUser.save();
};

describe('Users Module - Auth Routes', () => {
		before((done) => {
			// Get application
			_ct = new CommonTests();
			_ct.getTestApp().then((express) => {
				_app = express;
				_agent = request(express);
				// createUser().then(() => {
				_credentialsEmail = { email: 'test' + Math.floor(Math.random() * 10213123121) + 'xsaq12345hgjg3@email.com', password: 'Pass001' };
					return done();
				// });
			});
		});
		it('should be able to register new users : /api/auth/signup', (done) => {
			_agent.post('/api/auth/signup')
				.send(_credentialsEmail)
				.expect(200)
				.end((err, resp) => {
					// Call the assertion callback
					expect(resp.body.user).to.be.ok();
					expect(resp.body.token).to.be.ok();
					done(err);
				});
		});
		it('should be able to login existing users : /api/auth/signin', (done) => {
			_agent.post('/api/auth/signin')
				.send(_credentialsEmail)
				.expect(200)
				.end((err, resp) => {
					expect(resp.body.user).to.be.ok();
					expect(resp.body.token).to.be.ok();
					done(err);
				});
		});
		it('should be able to logout existing logged in users : api/auth/signout', (done) => {
			_agent.post('/api/auth/signin')
				.send(_credentialsEmail)
				.expect(200)
				.end((err, resp) => {
					expect(resp.body.user).to.be.ok();
					expect(resp.body.token).to.be.ok();
					if (err) {
						done(err);
					}
					// Logout
					_agent.get('/api/auth/signout')
						.expect(200)
						.end((signoutErr, signoutRes) => {
							if (signoutErr) {
								return done(signoutErr);
							}
							expect(signoutRes.body.user).to.be(null);
							return done();
						});
				});
		});
		after((done) => {

				_ct.closeTestApp().then(() => {
					done();
				});
		});
});
