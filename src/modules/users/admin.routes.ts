import * as express from 'express';
import AdminServerController from './controllers/admin.server.controller';
import AdminPolicy from './policies/admin.policy';

class AdminRoutes {
	public mount (app: express.Application) {
		app.route('/api/users')
			.get(AdminPolicy.isAllowed, AdminServerController.list);
		app.route('/api/users/:userId')
			.get(AdminPolicy.isAllowed, AdminServerController.read)
			.put(AdminPolicy.isAllowed, AdminServerController.update)
			.delete(AdminPolicy.isAllowed, AdminServerController.delete);
		app.param('userId', AdminServerController.userByID);
	}
}

export default new AdminRoutes();
