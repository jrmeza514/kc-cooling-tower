var http = require('http');
var express = require('express');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var socket = io( server );
let MINUTE = 60000;
let HOUR = MINUTE * 60;

var PORT = process.env.PORT || 8000;

app.use( express.static( __dirname + "/dist/") );

let airTower = [];
let waterTower = [];

socket.on('connection', function( client ){
  /*
    Send the client confirmation of a successful connection
  */
  client.emit('connected');

	client.emit('loadAirTower', airTower);
	client.emit('loadWaterTower', waterTower);

	client.on('airTower', function(towerEntry){
		addToTower(airTower, towerEntry);
		client.emit('receiveAirTower', towerEntry );
    client.broadcast.emit('receiveAirTower', towerEntry );
    console.log(airTower);
	});

	client.on('waterTower', function(towerEntry){
		addToTower(waterTower, towerEntry);
		client.emit('receiveWaterTower', towerEntry );
    client.broadcast.emit('receiveWaterTower', towerEntry );
	});

  client.on('deleteEntry', function( res ){
    let tower = null;
    let trigger = null;
    switch (res.towerName) {
      case 'airTower':
        tower = airTower
        trigger = 'loadAirTower';
        break;
      case 'waterTower':
        tower = waterTower;
        trigger = 'loadWaterTower';
        break;
      default:
        break;
    }
    if (tower) {
      tower.splice(res.index, 1);
      client.emit( trigger, tower);
      client.broadcast.emit(trigger, tower);
    }
  });
	setInterval(function(){
		timeAudit(airTower, 'loadAirTower');
		timeAudit(waterTower, 'loadWaterTower');
	}, 30000);

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
	var d = new Date(),
	h = d.getHours(),
	m = d.getMinutes();
	return h * HOUR + m * MINUTE;
}

function getTimeLeft( item ){
	let exitTime = item.exitTime;
	let now = getTimeAsNumber();
	let timeLeft = exitTime - now;

	return timeLeft;
}
function addToTower(tower, item){
	if (tower.length == 0 ) {
		tower.push(item);
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
		return;
	}

	for (var i = 0; i < tower.length; i++) {
		let x = tower[i];
		if (item.time < x.time ) {
				tower.splice(i, 0, item);
				break;
		}
	}
}
server.listen( PORT );
