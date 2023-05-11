import 'mocha';
import app from '../App';
import ConnectToMongo from '../lib/mongoose';
import APP_CONFIG from '../config/config';
import * as http from 'http';
import mongoose from 'mongoose';

export default class CommonTests {
	private httpServer;
	existingApp;
	public getTestApp = (): Promise <any> => {
		return new Promise((resolve, reject) => {
			ConnectToMongo.connect(APP_CONFIG.db.uri)
				.then(() => {
					this.httpServer = http.createServer(app);
					this.httpServer.listen(APP_CONFIG.port, (err) => {
						if (err) {
							return console.log(err);
						}
						this.existingApp = app;
						return resolve(app);
					});
				});
		});
	}
	public closeTestApp = (): Promise <any> => {
		return new Promise((resolve, reject) => {
			this.httpServer.close();
			this.clearCollections().then(() => {
				const connection = mongoose.connection;
				connection.close();
				resolve(true);
			});
		});
	}

	async clearCollections() {
		const collections = mongoose.connection.collections;
		await Promise.all(Object.values(collections).map(async (collection) => {
			await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
		}));
	}

}
