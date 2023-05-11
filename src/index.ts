// import './pre-start';
import app from './App';
import ConnectToMongo from './lib/mongoose';
import APP_CONFIG from './config/config';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import User from './modules/users/model/user.model';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const port = process.env.PORT || APP_CONFIG.port;

let _server;

class StartExpress {
	_server;
	public init() {
		ConnectToMongo.connect()
			.then(() => {
				this.createServer();
			})
			.catch((err) => {
				console.log('=============================================================');
				console.log(APP_CONFIG.app.title);
				console.log('=============================================================');
				console.log('[ERROR] :     ...Could not connect to MongoDB!');
				console.log(err);
				console.log('=============================================================');
			});
	}
	private createServer() {
		if (APP_CONFIG.secure && APP_CONFIG.secure.ssl) {
			const options = this.getSecureOptions();
			// Create new HTTPS Server
			_server =  https.createServer(options, app);
		} else {
			// Create a new HTTP server
			_server = http.createServer(app);
		}
		_server.listen(port, (err) => {
			if (err) {
				return console.log(err);
			}
			const server = (isProd ? 'https://localhost' : 'http://localhost') + ':' + port;
			console.log('=============================================================');
			console.log(APP_CONFIG.app.title);
			console.log('=============================================================');
			console.log('Environment:     ' + nodeEnv);
			console.log('Server:          ' + server);
			console.log('Database:        ' + APP_CONFIG.db.uri);
			console.log('App version:     ' + '0.0.1');
			console.log('=============================================================');
			// this.Seed().then((u) => {
			// 	console.log('=============================================================');
			// 	console.log('User created:        ' + u);
			// }).catch((err) => {
			// 	console.log(err)
			// 	console.log('============================================================')
			// })
			return;
		});
	}
	private getSecureOptions() {
		// Load SSL key and certificate
		const privateKey = fs.readFileSync(path.resolve(APP_CONFIG.secure.privateKey), 'utf8');
		const certificate = fs.readFileSync(path.resolve(APP_CONFIG.secure.certificate), 'utf8');
		let caBundle;
		try {
			caBundle = fs.readFileSync(path.resolve(APP_CONFIG.secure.caBundle), 'utf8');
		} catch (err) {
			console.log('Warning: couldn\'t find or read caBundle file');
		}
		return{
			key: privateKey,
			cert: certificate,
			ca: caBundle,
			//  requestCert : true,
			//  rejectUnauthorized : true,
			secureProtocol: 'TLSv1_method',
			ciphers: [
				'ECDHE-RSA-AES128-GCM-SHA256',
				'ECDHE-ECDSA-AES128-GCM-SHA256',
				'ECDHE-RSA-AES256-GCM-SHA384',
				'ECDHE-ECDSA-AES256-GCM-SHA384',
				'DHE-RSA-AES128-GCM-SHA256',
				'ECDHE-RSA-AES128-SHA256',
				'DHE-RSA-AES128-SHA256',
				'ECDHE-RSA-AES256-SHA384',
				'DHE-RSA-AES256-SHA384',
				'ECDHE-RSA-AES256-SHA256',
				'DHE-RSA-AES256-SHA256',
				'HIGH',
				'!aNULL',
				'!eNULL',
				'!EXPORT',
				'!DES',
				'!RC4',
				'!MD5',
				'!PSK',
				'!SRP',
				'!CAMELLIA'
			].join(':'),
			honorCipherOrder: true
		};
	}

	private Seed(): Promise<any> {
		if (nodeEnv === 'development') {
			return this.createAdminUser();
		}
	}
	private createAdminUser = (): Promise<any> => {
		const _credentialsEmail = { email: 'aretanafernandez@gmail.com', password: 'London2011!' };
		const _user = {
			email: _credentialsEmail.email,
			password: _credentialsEmail.password,
			provider: 'local',
			roles: ['admin', 'user']
		};
		const _testUser = new User(_user);
		return _testUser.save();
	};
}


new StartExpress().init();


