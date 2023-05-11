
import AdminRoutes from '../modules/users/admin.routes';
import AuthRoutes from '../modules/users/auth.routes';
import CoreRoutes from '../modules/core/core.routes';
import CMSRoutes from '../modules/wierzbianski/wierzbianski.routes';
import UserRoutes from '../modules/users/users.routes';
import User from '../modules/users/model/user.model';
import AdminPolicy from '../modules/users/policies/admin.policy';
import CmsPolicy from '../modules/wierzbianski/policy/cms.policy';
export const MODELS_LIST = [
	User,
];
export const POLICIES_LIST = [
	AdminPolicy,
	CmsPolicy
];
export const ROUTES_LIST = [
	AuthRoutes,
	UserRoutes,
	AdminRoutes,
	CMSRoutes,
	// always the last one
	CoreRoutes,
];
