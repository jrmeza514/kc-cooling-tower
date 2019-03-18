const MONGODB_URI = "mongodb://heroku_7t9tzmh9:qbfp6lrquf5ou7uuhvi516pnn1@ds047305.mlab.com:47305/heroku_7t9tzmh9";
const MongoClient = require('mongodb').MongoClient;
const luxon = require('luxon');

class MongoManager {
	constructor(){}

	addAirTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('AIR_TOWER').insertOne(item)
			.then(result => {
				client.close();
			});
		});
	}

	addToWaterTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('WATER_TOWER').insertOne(item)
			.then(result => {
				client.close();
			})
		});
	}

	getAirTower(c){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('AIR_TOWER').find({})
			.toArray((err, res) => {
				if (err) throw err;
				c(res);
			});
			client.close();
		});
	}

	getWaterTower(c){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('WATER_TOWER').find({})
			.toArray((err, res) => {
				if (err) throw err;
				c(res);
			});
			client.close();
		});
	}

	deleteFromAirTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('AIR_TOWER').deleteOne({
				_id: item._id
			});
			client.close();
		});
	}

	deleteFromWaterTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection('WATER_TOWER').deleteOne({
				_id: item._id
			});
			client.close();
		});
	}

	addToLog(item, towerName){
		let lx = luxon.DateTime.fromMillis(item.time);
	  item.time = luxon.DateTime.fromMillis(item.time).toISO().substr(0,16).replace('T', ' ');
	  item.exitTime = luxon.DateTime.fromMillis(item.exitTime).toISO().substr(0,16).replace('T', ' ');
	  let date = lx.toLocaleString().split('/').join('-');
	  let logName = date + `-${towerName}-log.json`;


		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection(logName).insertOne(item)
			.then(result => {
				client.close();
			})
			.catch(err => {
				console.log(err);
			});
		});
	}

	getLog(logName, c){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('heroku_7t9tzmh9');
			db.collection(logName).find({})
			.toArray((err, res) => {
				if (err) throw err;
				c(res);
			});
			client.close();
		});
	}
}

module.exports = MongoManager;
