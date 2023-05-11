import * as express from 'express';
import UserServerController from './controllers/user.server.controller';

class UserRoutes {
	public mount (app: express.Application) {
		app.route('/api/users/me').get(UserServerController.me);
		app.route('/api/users').put(UserServerController.update);
		app.route('/api/users/password').post(UserServerController.changePassword);
		app.param('userId', UserServerController.userByID);
	}
}

export default new UserRoutes();