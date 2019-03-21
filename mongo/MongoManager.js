const MONGODB_URI = "mongodb+srv://jrmeza514:eOvRE08VknB7iJ5c@cluster0-dmufo.mongodb.net/test?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const luxon = require('luxon');

class MongoManager {
	constructor(){}


	updateWaterTower(item){
		console.log(item.exitTime);
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
			db.collection('WATER_TOWER').updateOne(
				{_id: ObjectID(item._id) },
				{
					$set: {
						exitTime: item.exitTime
					}
				},
				function(err, res) {
					if (err) throw err;
					client.close();
				});
		});
	}

	updateAirTower(item){
		console.log(item.exitTime);
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
			db.collection('AIR_TOWER').updateOne({_id: ObjectID(item._id) },{
				$set: {
					exitTime: item.exitTime
				}
			},
			function(err, res) {
				if (err) throw err;
				client.close();
			});
		});
	}

	addAirTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
			db.collection('AIR_TOWER').insertOne(item)
			.then(result => {
				client.close();
			});
		});
	}

	addToWaterTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
			db.collection('WATER_TOWER').insertOne(item)
			.then(result => {
				client.close();
			})
		});
	}

	getAirTower(c){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
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
			let db = client.db('cooling-tower');
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
			let db = client.db('cooling-tower');
			db.collection('AIR_TOWER').deleteOne({
				_id: item._id
			});
			client.close();
		});
	}

	deleteFromWaterTower(item){
		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('cooling-tower');
			db.collection('WATER_TOWER').deleteOne({
				_id: item._id
			});
			client.close();
		});
	}

	addToLog(item, towerName){
		let lx = luxon.DateTime.fromMillis(item.time).setZone('America/Los_Angeles');
	  item.time = luxon.DateTime.fromMillis(item.time).setZone('America/Los_Angeles').toISO().substr(0,16).replace('T', ' ');
	  item.exitTime = luxon.DateTime.fromMillis(item.exitTime).setZone('America/Los_Angeles').toISO().substr(0,16).replace('T', ' ');
	  let date = lx.toLocaleString().split('/').join('-');
	  let logName = date + `-${towerName}-log`;


		MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('logs');
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
			let db = client.db('logs');
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
