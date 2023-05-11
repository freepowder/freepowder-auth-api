import * as express from 'express';
import AuthServerController from './controllers/auth.server.controller';

class AuthRoutes {
	public mount (app: express.Application) {
		// Auth
		app.route('/api/auth/signin').post(AuthServerController.signin);
		app.route('/api/auth/signup').post(AuthServerController.signup);
		app.route('/api/auth/signout').get(AuthServerController.signout);
	}
}

export default new AuthRoutes();
