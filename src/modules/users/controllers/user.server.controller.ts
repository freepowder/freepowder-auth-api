import { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import Auth from '../../../lib/auth';
import * as jwt from 'jsonwebtoken';
import APP_CONFIG from '../../../config/config';
import * as _ from 'lodash';
const SIX_MONTHS = 15778476000;

class UserServerController {
	/**
	 * @api {get} /api/users/me User GET
	 * @apiName me
	 * @apiVersion 1.0.0
	 * @apiDescription Returns boolean for the current logged in user
	 * @apiGroup USERS
	 * @apiPermission user role
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
 	 *       "status": true,
     *     }
	 *
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 404 NotFound Error
	 * {
	 *  "message": "Not Found"
	 * }
	 */
	public me = (req: Request, res: Response): void => {
		// @ts-ignore
		try {
			const verified = jwt.verify(req.headers.authorization.split(' ')[1], APP_CONFIG?.Jwt.Secret);

			if (verified) {

				 res
					.status(200)
					.json({ status: true });
			} else {
				// Access Denied
				res.status(401).json({ status: false });
			}
		} catch (error) {
			// Access Denied
			res.status(401).json({ status: false });
		}

	}
	/**
	 * @api {put} /api/users User PUT
	 * @apiName update me
	 * @apiVersion 1.0.0
	 * @apiDescription Update the current logged in user
	 * @apiGroup USERS
	 * @apiPermission user role
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
 	 *       "user": { "email":"awesome.gmail.com", "roles":["user"]},
     *     }
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 400  Bad Request Error
	 * {
	 *  "message": "User is invalid"
	 * }
	 */
	public update = (req: Request, res: Response): void => {
		// @ts-ignore
		User.findById(req.auth._id, '-salt -password -provider')
			.then((user) => {
				user = _.extend(user, req.body);
				user['updated'] = new Date();
				user.save()
					.then((iuser) => {
						iuser['password'] = undefined;
						iuser['salt'] = undefined;
						const token = jwt.sign(iuser.toObject(), APP_CONFIG.Jwt.Secret, { expiresIn: SIX_MONTHS });
						req.logIn(iuser, (err) => {
							if (err) {
								res.status(400).send(err);
							} else {
								res.status(200).json({ user: iuser, token: token });
							}
						});
					})
					.catch((err) => {
						return res.status(422).send({
							message: err
						});
					});
			})
			.catch((err) => {
				res.status(401).send({
					message: 'User is not signed in'
				});
			});
	}
	public userByID = (req: Request, res: Response, next: NextFunction, id: string) => {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send({
				message: 'User is invalid'
			});
		}
		User.findById(id, '-salt -password -provider')
			.then((user) => {
				if (!user) {
					return next(new Error('Failed to load user ' + id));
				}
				req.user = user;
				next();
			})
			.catch((err) => {
				return next(err);
			});
	}
	/**
	 * @api {post} /api/users/password CHANGE PASSWORD
	 * @apiName change password
	 * @apiVersion 1.0.0
	 * @apiDescription Change User Password logged in user
	 * @apiGroup USERS
	 * @apiPermission user role
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *  		"user": {
	 *  		    "email":"awesome.gmail.com",
	 *  		     "firstName":"firstName",
	 *  		     "lastName":"lastName",
	 *  		     "username":"username",
	 *  		     "updated":"updated",
	 *  		     "roles": "admin,user"
	 *  		}
	 * 		}
	 *
	 * @apiErrorExample {json} Error-Response:
	 * 		HTTP/1.1 422  Unprocessable entity
	 * 		{
	 *  		"message": "old password is not correct"
	 * 		}
	 */
	public changePassword = (req: Request, res: Response): void => {
		// 1 check auth with old password is the correct one
		// @ts-ignore
		Auth.authenticate(req.auth.email, req.body.password)
			.then((user) => {
				user['salt'] = crypto.randomBytes(16).toString('base64');
				user['password'] = Auth.hashPassword(req.body.newPassword, user['salt']);
				user.save()
					.then((_user) => {
						_user.password = undefined;
						_user.salt = undefined;
						return res.status(200).json({ user: _user });
					})
					.catch((err) => {
						return res.status(422).send({message: err});
					});
			}).catch((err) => {
				return res.status(422).send({message: err});
			});
	}
}

export default new UserServerController();
