/**
 * Pre-start is where we want to place things that must run BEFORE the express 
 * server is started. This is useful for environment variables, command-line 
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from 'path';
import dotenv from 'dotenv';
import {JwtPayload} from 'jsonwebtoken';

const env = process.env.NODE_ENV || 'development';

// Set the env file
if ( env !== 'production') {

  const result2 = dotenv.config({
    path: path.join(__dirname, `../env/${env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }
}



declare global {
  namespace Express {
    interface Request {
      auth: JwtPayload;
    }
  }
}
