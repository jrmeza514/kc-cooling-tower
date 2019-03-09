var http = require('http');
var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var socket = io( server );
let MINUTE = 60000;
let HOUR = MINUTE * 60;
const JSON_FILE_SAVE = __dirname + '/saves/towers.json';
const JSON_DELETED_SAVE = __dirname + '/saves/deleted.json';

var PORT = process.env.PORT || 8000;

app.use( express.static( __dirname + "/v2/build/") );

let deleted = {
  airTower: [],
  waterTower: []
}

let towers = {
  airTower: [],
  waterTower: []
}
loadJSON();

socket.on('connection', function( client ){
  /*
    Send the client confirmation of a successful connection
  */
  client.emit('connected');

	client.emit('loadAirTower', towers.airTower);
	client.emit('loadWaterTower', towers.waterTower);

	client.on('airTower', function(towerEntry){
		addToTower(towers.airTower, towerEntry);
		client.emit('receiveAirTower', towerEntry );
    client.broadcast.emit('receiveAirTower', towerEntry );
	});

	client.on('waterTower', function(towerEntry){
		addToTower(towers.waterTower, towerEntry);
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
        dTower = deleted.airTower;
        trigger = 'loadAirTower';
        break;
      case 'waterTower':
        tower = towers.waterTower;
        dTower = deleted.waterTower;
        trigger = 'loadWaterTower';
        break;
      default:
        break;
    }
    if (tower) {
      let deleted = tower.splice(res.index, 1);
      if (deleted.length > 100 ) {
        deleted.shift();
      }
      dTower.push(deleted);
      console.log(deleted);
      client.emit( trigger, tower);
      client.broadcast.emit(trigger, tower);
    }

    saveTowersToJSON();
  });
	// setInterval(function(){
	// 	timeAudit(airTower, 'loadAirTower');
	// 	timeAudit(waterTower, 'loadWaterTower');
  //   console.log('audit');
	// }, 30000);

	function timeAudit( tower , trigger){
		for (let i =0; i < tower.length; i++){
			let item = tower[i];
			let timeLeft = getTimeLeft(item);

			if (timeLeft < -5 * MINUTE){

				let deletedItem = tower.splice( i, 1);
				console.log(`Deleted Entry: ${deletedItem}`);
        client.emit( trigger, tower);
        client.broadcast.emit(trigger, tower);
			}
		}
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
function addToTower(tower, item){
	if (tower.length == 0 ) {
		tower.push(item);
    saveTowersToJSON();
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
    saveTowersToJSON();
		return;
	}

	for (var i = 0; i < tower.length; i++) {
		let x = tower[i];
		if (item.time < x.time ) {
				tower.splice(i, 0, item);
				break;
		}
	}

  saveTowersToJSON();
}

function saveTowersToJSON(){
  let json = JSON.stringify(towers);
  let del = JSON.stringify(deleted);

  console.log(json);
  fs.writeFile(JSON_FILE_SAVE, json, 'utf8', (e) => {
    if (e && e.code == 'ENOENT') {
      createSavesFolder();
    }

    console.log(`${JSON_FILE_SAVE} SAVED`);
  });

  console.log(deleted);
  fs.writeFile(JSON_DELETED_SAVE, del, 'utf8', (e) => {
    if (e && e.code == 'ENOENT') {
      createSavesFolder();
    }

    console.log(`${JSON_DELETED_SAVE} SAVED`);
  });
}

function loadJSON(){
  fs.readFile( JSON_FILE_SAVE, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    towers = JSON.parse(data);

  }});

  fs.readFile( JSON_DELETED_SAVE, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    deleted = JSON.parse(data);

  }});
}

function createSavesFolder(){
  if (!fs.existsSync('./saves')){
      fs.mkdirSync('./saves');
  }
}
server.listen( PORT );
