import { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';
import * as mongoose from 'mongoose';


class AdminServerController {
	/**
	 * @api {get} /api/users Users GET
	 * @apiName users
	 * @apiVersion 1.0.0
	 * @apiDescription Returns all the existing users in MongoDB
	 * @apiGroup ADMIN
	 * @apiPermission admin role
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
 	 *       "users": [{ "email":"awesome.gmail.com", "roles":["user"]}],
     *     }
	 *
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 404 NotFound Error
	 * {
	 *  "message": "Not Found"
	 * }
	 */
	public list = (req: Request, res: Response): void => {
		User.find({}, '-salt -password -provider')
			.then((users) => {
				res.status(200).json(users);
			})
			.catch((err) => {
				return res.status(422).send({message: err});
			});
	};
	/**
	 * @api {get} /api/users/:userId User GET
	 * @apiName user
	 * @apiVersion 1.0.0
	 * @apiDescription Return single user from MongoDB
	 * @apiGroup ADMIN
	 * @apiPermission admin role
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
 	 *       "user": { "email":"awesome.gmail.com", "roles":["user"]},
     *     }
	 *
	 * @apiErrorExample {json} Error-Response:
	 * HTTP/1.1 404 NotFound Error
	 * {
	 *  "message": "Not Found"
	 * }
	 */
	public read = (req: Request, res: Response): void => {};
	
	/**
	 * @api {put} /api/users/:userId User PUT
	 * @apiName update user
	 * @apiVersion 1.0.0
	 * @apiDescription Updates a user in MongoDB
	 * @apiPermission admin role
	 * @apiGroup ADMIN
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
	public update = (req: Request, res: Response): void => {};

	/**
	 * @api {delete} /api/users/:userId User DELETE
	 * @apiName delete user
	 * @apiVersion 1.0.0
	 * @apiDescription Delete a user in MongoDB
	 * @apiGroup ADMIN
	 * @apiPermission admin role
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * 		HTTP/1.1 200 OK
	 * 		{
	 * 			"user": { "email":"awesome.gmail.com", "roles":["user"]},
	 * 		}
	 * @apiErrorExample {json} Error-Response:
	 * 		HTTP/1.1 400  Bad Request Error
	 * 		{
	 *  		"message": "User is invalid"
	 * 		}
	 */
	public delete = (req: Request, res: Response): void => {};
	
	
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
				req['model'] = user;
				next();
			})
			.catch((err) => {
				return next(err);
			});
	};
}

export default new AdminServerController();
