var http = require('http');
var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var bodyParser = require('body-parser');
var MongoManager = require('./mongo/MongoManager.js');
const luxon = require('luxon');


var app = express();
var server = http.createServer(app);
var socket = io( server );
const router = express.Router();
const DBManager = new MongoManager();

const MINUTE = 60000;
const HOUR = MINUTE * 60;
const JSON_FILE_SAVE = __dirname + '/saves/towers.json';
const PORT = process.env.PORT || 8000;


router.get('/:logDate', (req, res) => {
  console.log(req.params)
  let logFile = __dirname + '/saves/' + req.params.logDate + '-log.json';
  fs.readFile(logFile , 'utf8', function readFileCallback(err, data){
    if (err){
        res.send(err);
    } else {
      res.send(data);
    }
  });
});

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/v2/log_viewer/index.html');
});

app.use('/logs', router);
app.use( '/', express.static( __dirname + "/v2/build/") );


let towers = {
  airTower: [],
  waterTower: []
}

socket.on('connection', function( client ){
  loadDBData(client);
  client.emit('connected');


	client.emit('loadAirTower', towers.airTower);
	client.emit('loadWaterTower', towers.waterTower);

	client.on('airTower', function(towerEntry){
		addToTower(towers.airTower, towerEntry, 'AIR_TOWER');
		client.emit('receiveAirTower', towerEntry);
    client.broadcast.emit('receiveAirTower', towerEntry );
	});

	client.on('waterTower', function(towerEntry){
		addToTower(towers.waterTower, towerEntry, 'WATER_TOWER');
		client.emit('receiveWaterTower', towerEntry );
    client.broadcast.emit('receiveWaterTower', towerEntry );
	});

  client.on('deleteEntry', function( res ){
    let tower = null;
    let dTower = null;
    let trigger = null;
    switch (res.towerName) {
      case 'airTower':
        tower = towers.airTower;
        trigger = 'loadAirTower';
        break;
      case 'waterTower':
        tower = towers.waterTower;
        trigger = 'loadWaterTower';
        break;
      default:
        break;
    }
    if (tower) {
      let deleted = tower.splice(res.index, 1)[0];
      client.emit( trigger, tower);
      client.broadcast.emit(trigger, tower);

      if(res.towerName == 'airTower') DBManager.deleteFromAirTower(deleted);
      if(res.towerName == 'waterTower') DBManager.deleteFromWaterTower(deleted);
    }

  });
});

function getTimeAsNumber(){
  return Date.now();
}

function getTimeLeft( item ){
	let exitTime = item.exitTime;
	let now = getTimeAsNumber() - 8 * HOUR;
	let timeLeft = exitTime - now;
  console.log(timeLeft / HOUR);

	return timeLeft;
}
function addToTower(tower, item, towerName){
  addToLog(item, towerName);

	if (tower.length == 0 ) {
		tower.push(item);
    saveToTower(tower, item, towerName);
		return;
	}

	if (item.time >= tower[tower.length - 1].time) {
		tower.push(item);
	}

	if (tower.length == 1 ) {
		if (tower[0].time < item.time) {
			tower.push(item);
		}else {
			tower.unshift(item);
		}
    saveToTower(tower, item, towerName);
		return;
	}

	for (var i = 0; i < tower.length; i++) {
		let x = tower[i];
		if (item.time < x.time ) {
				tower.splice(i, 0, item);
				break;
		}
	}

  saveToTower(tower, item, towerName);
}

function saveToTower(tower, item, towerName){
  switch (towerName) {
  case 'WATER_TOWER':
    DBManager.addToWaterTower(item);
    break;
  case 'AIR_TOWER':
    DBManager.addAirTower(item);
    break;
  default:
    break;
  }
}

function loadDBData(client){
  DBManager.getAirTower(res => {
    towers.airTower = res;
    client.emit('loadAirTower', towers.airTower);
  });

  DBManager.getWaterTower(res => {
    towers.waterTower = res;
  	client.emit('loadWaterTower', towers.waterTower);
  });
}

function addToLog(item, towerName){
  DBManager.addToLog(JSON.parse(JSON.stringify(item)), towerName);
}
server.listen( PORT );
