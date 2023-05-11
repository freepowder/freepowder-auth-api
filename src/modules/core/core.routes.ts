import * as express from 'express';
import CoreServerController from './core.server.controller';

class CoreRoutes {
	/**
	 * Core routes binding
	 * @param {e.Application} app
	 */
	public mount(app: express.Application){
		app.route('/').get(CoreServerController.renderIndex);
		app.route('/server-error').get(CoreServerController.renderServerError);
		app.route('/:url(api|modules|lib)/*').get(CoreServerController.renderNotFound);
	}
}
export default new CoreRoutes();
