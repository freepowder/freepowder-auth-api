import './pre-start';
import express from 'express';
import ExpressConfig from './lib/express';

class App {
	public app: express.Application;
	private expressConfig = ExpressConfig;
	constructor () {
		this.app = express();
		this.config();
	}
	private config(): void {
		this.expressConfig.init(this.app);
	}
}

export default new App().app;
