const request = require('supertest');
import CommonTests from '../../../common.tests';
const mongoose = require('mongoose');
const expect = require('expect.js');
import User from '../../../../modules/users/model/user.model';


let _app, _agent, _conn, _ct, _credentialsEmail, _user, _testUser;

describe('Users Module - User Routes', () => {
		before((done) => {
			// Get application
			_ct = new CommonTests();
			_ct.getTestApp().then((app) => {
				_app = app;
				_agent = request(app);
				_credentialsEmail = {email: 'test' + Math.floor(Math.random() * 10433341) + 'xzy@email.com', password: 'Pass001' };
				_user = {
					email: _credentialsEmail.email,
					password: _credentialsEmail.password,
					provider: 'local',
				};
				_testUser = new User(_user);
				done();
			});
		});
		
		it('should be able to get current user : /api/users/me', (done) => {
			_testUser.save()
				.then((us) => {
					expect(us).to.be.ok();
					_agent.post('/api/auth/signin')
						.send(_credentialsEmail)
						.expect(200)
						.end((err, resp) => {
							expect(resp.body.user).to.be.ok();
							expect(resp.body.token).to.be.ok();
							if (err) {
								done(err);
							}
							// get Me
							_agent.get('/api/users/me')
								.set('authorization', 'Bearer ' + resp.body.token)
								.expect(200)
								.end((usErr, usRes) => {
									if (usErr) {
										return done(usErr);
									}
									expect(usRes.body).to.be.ok();
									return done();
								});
						});
				})
				.catch((err) => {
					done(err);
				});
			
		});
		
		it('should be able to update current user : /api/users', (done) => {
			//_credentialsEmail = { email: 'test2@email.com', password: 'Pass001' };

			_testUser.save()
				.then((us) => {
					expect(us).to.be.ok();
					_agent.post('/api/auth/signin')
						.send(_credentialsEmail)
						.expect(200)
						.end((err, resp) => {
							expect(resp.body.user).to.be.ok();
							expect(resp.body.token).to.be.ok();
							if (err) {
								done(err);
							}
							// put Me
							_agent.put('/api/users')
								.send({firstName: 'test'})
								.set('authorization', 'Bearer ' + resp.body.token)
								.expect(200)
								.end((usErr, usRes) => {
									if (usErr) {
										return done(usErr);
									}
									expect(usRes.body).to.be.ok();
									return done();
								});
						});
				})
				.catch((err) => {
					done(err);
				});
			
		});
		
		it('should be able to update current password : /api/users/password', (done) => {
			//_credentialsEmail = { email: 'test2@email.com', password: 'Pass001' };
			_testUser.save()
				.then((us) => {
					expect(us).to.be.ok();
					_agent.post('/api/auth/signin')
						.send(_credentialsEmail)
						.expect(200)
						.end((err, resp) => {
							expect(resp.body.user).to.be.ok();
							expect(resp.body.token).to.be.ok();
							if (err) {
								done(err);
							}
							// put Me
							_agent.put('/api/users')
								.send({password: 'Pass001', newPassword: 'Pass002'})
								.set('authorization', 'Bearer ' + resp.body.token)
								.expect(200)
								.end((usErr, usRes) => {
									if (usErr) {
										return done(usErr);
									}
									expect(usRes.body).to.be.ok();
									return done();
								});
						});
				})
				.catch((err) => {
					done(err);
				});
			
		});
		after((done) => {


				_ct.closeTestApp().then(() => {
					done();

			});
		});
});
