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
const PORT = process.env.PORT || 8000;
const DOWNTIME_INT_MS = 1000;

var towerPowerStateInterval = null;

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/v2/log_viewer/index.html');
});

router.get('/css/main.css', (req, res) => {
  res.sendFile(__dirname + '/v2/log_viewer/css/main.css');
});

router.get('/:logDate', (req, res) => {
  console.log(req.params)
  let wlog = req.params.logDate + `-WATER_TOWER-log`;
  let alog = req.params.logDate + `-AIR_TOWER-log`;

  DBManager.getLog(wlog, (res1) => {
    console.log(res1);
    DBManager.getLog(alog, (res2) => {
      console.log(res2);
      res.send({
        airTower: res2,
        waterTower: res1
      });
    });
  });
});

app.use('/logs', router);
app.use( '/', express.static( __dirname + "/v2/build/") );


let towers = {
  airTower: [],
  waterTower: []
}

let WATER_TOWER_RUNNING = true;
let AIR_TOWER_RUNNING = true;

let waterTowerDownTime = 0;
let airTowerDownTime = 0;

socket.on('connection', function( client ){
  loadDBData(client);
  client.emit('connected');


	client.emit('loadAirTower', towers.airTower);
	client.emit('loadWaterTower', towers.waterTower);
  client.emit('loadAirTowerPowerState', AIR_TOWER_RUNNING);
  client.emit('loadWaterTowerPowerState', WATER_TOWER_RUNNING);

  client.on('airTowerPowerStateChange', function(isRunning){
    AIR_TOWER_RUNNING = isRunning;
    client.emit('loadAirTowerPowerState', AIR_TOWER_RUNNING);
    client.broadcast.emit('loadAirTowerPowerState', AIR_TOWER_RUNNING);
  });

  client.on('waterTowerPowerStateChange', function(isRunning){
    WATER_TOWER_RUNNING = isRunning;
    client.emit('loadWaterTowerPowerState', WATER_TOWER_RUNNING);
    client.broadcast.emit('loadWaterTowerPowerState', WATER_TOWER_RUNNING);
  });

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

  if (!towerPowerStateInterval) {
    towerPowerStateInterval = setInterval(function(){
      console.log("Cycle");
      if (!WATER_TOWER_RUNNING) waterTowerDownTime += DOWNTIME_INT_MS;
      if (!AIR_TOWER_RUNNING)  airTowerDownTime += DOWNTIME_INT_MS;

      if (WATER_TOWER_RUNNING && waterTowerDownTime != 0) {
        applyTowerDowntime(towers.waterTower, waterTowerDownTime, "WATER_TOWER");
        client.emit('loadWaterTower', towers.waterTower);
        client.broadcast.emit('loadWaterTower', towers.waterTower);
      }
      if (AIR_TOWER_RUNNING && airTowerDownTime != 0) {
        applyTowerDowntime(towers.airTower, airTowerDownTime, "AIR_TOWER");
        client.emit('loadAirTower', towers.airTower);
        client.broadcast.emit('loadAirTower', towers.airTower);
      }

      if(WATER_TOWER_RUNNING) waterTowerDownTime = 0;
      if (AIR_TOWER_RUNNING) airTowerDownTime = 0;
    }, DOWNTIME_INT_MS);
  }
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

function applyTowerDowntime(tower, time, towerName){

  for (let x = 0; x < tower.length; x++) {
    let entry = tower[x];
    console.log(entry.exitTime);
    entry.exitTime += time;
    switch (towerName) {
    case "WATER_TOWER":
      DBManager.updateWaterTower(JSON.parse(JSON.stringify(entry)));
      break;
    case "AIR_TOWER":
      DBManager.updateAirTower(JSON.parse(JSON.stringify(entry)));
      break;
    default:
    }
  }

}


server.listen( PORT );
