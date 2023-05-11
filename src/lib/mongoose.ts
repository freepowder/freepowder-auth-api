import APP_CONFIG from '../config/config';
import mongoose from 'mongoose';

class ConnectToMongo {
	public connect(uri = APP_CONFIG.db.uri): Promise<any> {
		return new Promise((resolve, reject) => {
			mongoose.connect(uri ).then(
				(d) => {
					resolve(true); },
				err => {
					reject(err);
				}
			);
		});
	}
}

export default new ConnectToMongo();
