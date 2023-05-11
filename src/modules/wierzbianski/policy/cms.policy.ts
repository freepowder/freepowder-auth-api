import acl from 'acl';
import { NextFunction, Request, Response } from 'express';
const _acl = new acl(new acl.memoryBackend);

class CmsPolicy {
    public invokeRolesPolicies = () => {
        _acl.allow([
            {
                roles: ['admin'],
                allows: [
                    {
                        resources: ['/api/wierzbianski/content', '/api/wierzbianski/content/:contentId'],
                        permissions: '*'
                    },
                ]
            },
            {
                roles: ['user'],
                allows: [
                    {
                        resources: ['/api/wierzbianski/content'],
                        permissions: ['get']
                    },
                    {
                        resources: ['/api/wierzbianski/content/:contentId'],
                        permissions: ['get']
                    },
                ]
            },
            {
                roles: ['guest'],
                allows: [
                    {
                        resources: ['/api/wierzbianski/content'],
                        permissions: ['get']
                    }
                ]
            }
        ]);
    };

    public isAllowed = (req: Request, res: Response, next: NextFunction) => {
        const roles = (req.auth) ? req.auth.roles : ['guest'];
        // Check for user roles
        _acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase()).then((isAllowed) => {

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

export default new CmsPolicy();
