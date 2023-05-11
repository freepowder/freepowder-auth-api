import { Request, Response } from 'express';
import { FP_CORE } from './core.constants';

class CoreServerController {
	/**
	 * Generic placeholder
	 */
	private message;
	
	/**
	 * Handle / route
	 * @param {e.Request} req
	 * @param {e.Response} res
	 */
	public renderIndex = (req: Request, res: Response): void => {
		this.message = FP_CORE.HOME;
		res.status(200).send(this.message);
	};
	
	/**
	 * Handle 404 routes
	 * @param {e.Request} req
	 * @param {e.Response} res
	 */
	public renderNotFound = (req: Request, res: Response) => {
		this.message = FP_CORE.ERROR;
		this.message.error.url = req.url;
		this.message.error.code = 404;
		res.status(404).send(this.message);
	};
	
	/**
	 * Handle Server Error
	 * @param {e.Request} req
	 * @param {e.Response} res
	 */
	public renderServerError = (req: Request, res: Response): void => {
		this.message = FP_CORE.ERROR;
		this.message.error.code = 500;
		res.status(500).send(this.message);
	}
}

export default new CoreServerController();