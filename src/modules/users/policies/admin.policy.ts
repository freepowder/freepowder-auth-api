import acl from 'acl';
import { NextFunction, Request, Response } from 'express';
const _acl = new acl(new acl.memoryBackend);
_acl.allow([
	{
		roles: ['admin'],
		allows: [
			{
				resources: '/api/users',
				permissions: '*'
			},
			{
				resources: ['/api/users/:userId', '/api/users/:userId/update-profile'],
				permissions: '*'
			}
		]
	},
	{
		roles: ['user'],
		allows: [
			{
				resources: ['/api/users/:userId/profile', '/api/users/:userId/update-profile'],
				permissions: '*'
			}
		]
	}
])
class AdminPolicy {
	 _acl = new acl(new acl.memoryBackend);
	public invokeRolesPolicies = () => {
		this._acl.allow([
			{
				roles: ['admin'],
				allows: [
					{
						resources: '/api/users',
						permissions: '*'
					},
					{
						resources: ['/api/users/:userId', '/api/users/:userId/update-profile'],
						permissions: '*'
					}
				]
			},
			{
				roles: ['user'],
				allows: [
					{
						resources: ['/api/users/:userId/profile', '/api/users/:userId/update-profile'],
						permissions: '*'
					}
				]
			}
		]);
	}
	public isAllowed = (req: Request, res: Response, next: NextFunction) => {
		const roles = (req.auth) ? req.auth['roles'] : ['guest'];
		// Check for user roles
		this._acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase()).then((isAllowed) => {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}).catch((err) => {
			return res.status(500).send('Unexpected authorization error');
		});
	}
}

export default new AdminPolicy();

