const request = require('supertest');
import CommonTests from '../../../common.tests';
const mongoose = require('mongoose');
const expect = require('expect.js');
import User from '../../../../modules/users/model/user.model';

let _app, _agent, _conn, _ct, _credentialsEmail, _user, _testUser;




const createAdminUser = (): Promise<any> => {
	_credentialsEmail = { email: 'test' + Math.floor(Math.random() * 10433341) + '1233@email.com', password: 'Pass001' };
	_user = {
		email: _credentialsEmail.email,
		password: _credentialsEmail.password,
		provider: 'local',
	};
	_testUser = new User(_user);
	_testUser['roles'] = ['user', 'admin'];
	return _testUser.save();
};


describe('Users Module - Admin Routes', () => 	{
	before((done) => {
		// Get application
		_ct = new CommonTests();
		_ct.getTestApp().then((app) => {
			_app = app;
			_agent = request(app);
			createAdminUser().then((user) => {
				done();
			})
		});
	});



	it(	'should be able to retrieve a list of users if admin : /api/users', (done) => {
		_agent.post('/api/auth/signin')
			.send(_credentialsEmail)
			.expect(200)
			.end((err, resp) => {
				expect(resp.body.user).to.be.ok();
				expect(resp.body.token).to.be.ok();
				if (err) {
					done(err);
				}
				// get Users
				_agent.get('/api/users')
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
		});
	it('should get 403 when try to retrieve a list of users if not admin : /api/users', (done) => {
			_agent.get('/api/users')
				.expect(403)
				.end((err, resp) => {
					if (err) {
						done(err);
					}
					// Call the assertion callback
					expect(resp.body.message).to.be('User is not authorized');
					return done(err);
				});
		});





	after((done) => {
			_ct.closeTestApp().then(() => {
				done();
			});
		}
 	);
});
