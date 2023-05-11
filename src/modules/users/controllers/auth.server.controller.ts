import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import APP_CONFIG from '../../../config/config';
import User from '../model/user.model';
import Auth from '../../../lib/auth';
import crypto from 'crypto';

const SIX_MONTHS = 15778476000;
const STRATEGY = 'local';


class AuthServerController {
	/**
	 * @api {post} /api/auth/signup Register
	 * @apiName signup
	 * @apiVersion 1.0.0
	 * @apiDescription Register a user by creating entry in MongoDB
	 * @apiGroup AUTH
	 * @apiPermission none
	 * @apiParamExample {json} Request-Example:
	 * { "email":"awesome.gmail.com", "password":"pass0012"}
	 * @apiSuccessExample {json} Success-Response:
	 * HTTP/1.1 200 OK
	 * {
 	 *  "user": { "email":"awesome.gmail.com", "roles":["user"]},
     *  "token": "generated jwt"
     * }
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 422 Unprocessable Entity
	 * {
	 *  "message": {
	 *   "driver": true,
	 *   "name": "MongoError",
	 *   "index": 0,
	 *   "code": 11000,
	 *   "errmsg": "E11000 duplicate key error : email"
	 *  }
	 * }
	 */
	public signup = (req: Request, res: Response): void => {
		delete req.body.roles;
		const user = new User(req.body);
		user['provider'] = STRATEGY;
		user['salt'] = crypto.randomBytes(16).toString('base64');
		user['password'] = Auth.hashPassword(req.body.password, user['salt']);
		user.save()
			.then((_user) => {
				_user['salt'] = undefined;
				_user['password'] = undefined;
				const token = jwt.sign(_user.toObject(), APP_CONFIG.Jwt.Secret, { expiresIn: SIX_MONTHS });
				req.logIn(_user, (err) => {
					if (err) {
						res.status(400).send(err);
					} else {
						res.status(200).json({ user: _user, token: token });
					}
				});
			})
			.catch((err) => {
				let message = 'Error creating a new user';
				if (err.code === 11000) {
					message = message + ': duplicated Email : ' + req.body.email;
				}
				return res.status(422).send({
					message: message
				});
			});
	}
	/**
	 * @api {post} /api/auth/signin Login
	 * @apiName signin
	 * @apiVersion 1.0.0
	 * @apiDescription Authenticate user against existing MongoDB users
	 * @apiGroup AUTH
	 * @apiPermission none
	 * @apiParamExample {json} Request-Example:
	 * { "email":"awesome.gmail.com", "password":"pass0012"}
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * HTTP/1.1 200 OK
	 * {
 	 *   "user": { "email":"awesome.gmail.com", "roles":["user"]},
     *   "token": "generated jwt"
     * }
	 *
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 422 Unprocessable Entity
	 * {
   	 * 	"message": "Invalid username or password"
     *}
	 *
	 */
	public signin = (req: Request, res: Response): void => {
		Auth.authenticate(req.body.email, req.body.password)
			.then((user) => {
				user.password = undefined;
				user.salt = undefined;
				const token = jwt.sign(user.toObject(), APP_CONFIG.Jwt.Secret, { expiresIn: SIX_MONTHS });
				req.logIn(user, (err) => {
					if (err) {
						res.status(400).send(err);
					} else {
						res.status(200).json({ user: user, token: token });
					}
				});
			})
			.catch((info) => {
				res.status(422).send(info);
			});
	}
	/**
	 * @api {get} /api/auth/signout Logout
	 * @apiName signout
	 * @apiVersion 1.0.0
	 * @apiDescription Logout user from request object
	 * @apiGroup AUTH
	 * @apiPermission none
	 * @apiSuccessExample {json} Success-Response:
	 * HTTP/1.1 200 OK
	 * {
 	 *   "user": null,
     *   "token": null
     * }
	 */
	public signout = (req: Request, res: Response): void => {
		req.logout(() => {
			req.auth = null;
			res.status(200).json({ user: null, token: null });
		});
	}
}

export default new AuthServerController();
