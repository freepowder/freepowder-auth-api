import express from 'express';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import passport from 'passport';
import session from 'express-session';
import { NextFunction, Response, Request } from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { expressjwt } from 'express-jwt';
import cors from 'cors';
import APP_CONFIG from '../config/config';
import { ROUTES_LIST, MODELS_LIST, POLICIES_LIST } from './helper';
import User from '../modules/users/model/user.model';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
const nodeEnv = process.env.NODE_ENV || 'development';


class ExpressConfig {
	private app: express.Application;
	private SIX_MONTHS = 15778476000;
	private ROUTES = ROUTES_LIST;
	readonly MODELS = MODELS_LIST;
	private POLICIES = POLICIES_LIST;

	public init(app: express.Application) {

		this.app = app;
		this.initAppLocals();
		this.initJwt();
		this.initMiddleware();
		this.initPassport();
		this.initHelmetHeaders();
		this.initServerPolicies();
		this.initServerRoutes();
		this.initErrorRoutes();
	}

	private initAppLocals(): void {
		this.app.locals.name = 'Free Powder';
		this.app.locals.title = APP_CONFIG?.app.title;
		this.app.locals.description = APP_CONFIG?.app.description;
		if (APP_CONFIG?.secure && APP_CONFIG?.secure.ssl) {
			this.app.locals.secure = APP_CONFIG?.secure.ssl;
		}
		this.app.locals.keywords = APP_CONFIG?.app.keywords;
	}

	private initJwt(): void {

		const whitelist = ['https://wierzbianski.freepowder.io', 'https://*.freepowder.io'];
		const corsOptions = {
			origin: function(origin, callback) {
				const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
				callback(null, originIsWhitelisted);
			},
			credentials: true
		};
		this.app.use(cors(corsOptions));

		this.app.use('/api', expressjwt({
			secret: APP_CONFIG?.Jwt.Secret,
			algorithms: ['HS256'],
			credentialsRequired: false, }).unless({
			path: [
				// public routes that don't require authentication
				'/api/wierzbianski/content',
				'/api/auth/signup',
				'/api/auth/signin',
				'/api/auth/signout'
			]
		}));

		this.app.use((req, res, next) => {
			if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
// console.log(req.headers.authorization.split(' ')[1]);
				jwt.verify(req.headers.authorization.split(' ')[1], APP_CONFIG?.Jwt.Secret
					, ( err, decoded) => {
						if (err) {
							res.status(401).json({
								site: 'https://api.freepowder.com/',
								error: {
									url: req.url,
									message: 'Invalid token',
									code: 401
								}
							});
						}
						next();
				});
			} else {
				next();
			}
		});
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
			if (!err) {
				return next();
			}
			if (err.name === 'UnauthorizedError') {
				res.status(401).json({
					site: 'https://api.freepowder.com/',
					error: {
						url: req.url,
						message: 'Invalid token',
						code: 401
					}
				});
			}
		});
	}
	private initMiddleware() {
		// compression
		this.app.use(compress({
			filter(req: Request, res: Response) {
				return (/json|text|javascript|css|font|svg/)
					.test(res.getHeader('Content-Type') ? res.getHeader('Content-Type').toString() : '');
			},
			level: 9
		}));
		// body & cookie parser
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(methodOverride());
		this.app.use(cookieParser(APP_CONFIG.CookieProps.Secret));
		if (nodeEnv === 'development') {
			this.app.use(morgan('tiny'));
		}
	}
	private initPassport(): void {

		//

		this.app.use(session({
			secret: APP_CONFIG.CookieProps.Secret,
			resave: true,
			saveUninitialized: true,
		}));
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		this.app.use((req, res, next) => {
			res.locals.user = req.user;
			next();
		});

	}
	private initHelmetHeaders(): void {
		this.app.use(helmet.frameguard());
		this.app.use(helmet.xssFilter());
		this.app.use(helmet.noSniff());
		this.app.use(helmet.ieNoOpen());
		this.app.use(helmet.hsts({
			maxAge: this.SIX_MONTHS,
			includeSubDomains: true,
		}));
		this.app.disable('x-powered-by');
	}
	private initServerPolicies(): void {
		this.POLICIES.forEach((policy) => {
			policy.invokeRolesPolicies();
		});
	}
	private initServerRoutes(): void {
		this.ROUTES.forEach((routes) => {
			routes.mount(this.app);
		});
	}
	private initErrorRoutes(): void {
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
			if (!err) {
				return next();
			}
			console.log(err);
			res.redirect('/server-error');
		});
		this.app.use((req: Request, res: Response) => {
			res.status(404).send({
				site: 'https://api.freepowder.com/',
				error: {
					url: req.url,
					message: 'Not Found : These are not the droids you are looking for.',
					code: 404
				}
			});
		});
	}
}

export default new ExpressConfig();
