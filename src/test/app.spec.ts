import 'mocha';
import * as request from 'supertest';
import CommonTests from './common.tests';
const mongoose = require('mongoose');
const expect = require('expect.js');

let _app, _agent, _conn, _ct;

describe('App - Express init', () => {
	before( (done) => {
		// Get application
		_ct = new CommonTests();
		_ct.getTestApp().then((app) => {
			_app = app;
			_agent = request.agent(app);
			done();
		});
	});
	it('server should init the correct Express Free Powder App', (done) => {
		expect(_app.locals.name).to.be('Free Powder');
		done();
	});
	after((done) => {
		_ct.closeTestApp().then(() => {
			done();
		});
	});
});

describe('App - Server routes', () => {
	before( (done) => {
		// Get application
		_ct = new CommonTests();
		_ct.getTestApp().then((app) => {
			_app = app;
			_agent = request.agent(app);
			done();
		});
	});
	it('server should return 200 when requested a existing route', (done) => {
		_agent.get('/')
			.expect(200)
			.end( (err, resp) => {
				// Call the assertion callback
				done(err);
			});
	});
	it('server should return 404 when requested a non-existing route', (done) => {
		_agent.post('/some-route-that-not-exist')
			.send({something: 'here'})
			.expect(404)
			.end( (err, resp) => {
				// Call the assertion callback
				done(err);
			});
	});
	it('server should return 403 when requested a protected route', (done) => {
		_agent.get('/api/users')
			.expect(403)
			.end( (err, resp) => {
				// Call the assertion callback
				done(err);
			});
	});
	after((done) => {
		_ct.closeTestApp().then(() => {
			done();
		});
	});
});
