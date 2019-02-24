let KCTC = ( () => {
  let AIR_TOWER = [];
	let WATER_TOWER = [];
	let MINUTE = 60000;
	let HOUR = MINUTE * 60;
	let DAY = HOUR * 24;
	let TL = {
		'airTowerList': document.getElementById('airTowerList'),
		'waterTowerList': document.getElementById('waterTowerList')
	};
  const SERVER = {
    connected: false,
    url: 'https://kc-cooling-tower.herokuapp.com'
  };

	let atwo = document.getElementById('atwo');
	let atpid = document.getElementById('atpid');
	let atdesc = document.getElementById('atdesc');
	let att = document.getElementById('att');
	let atsb = document.getElementById('atsb');


	let wtwo = document.getElementById('wtwo');
	let wtpid = document.getElementById('wtpid');
	let wtdesc = document.getElementById('wtdesc');
	let wtt = document.getElementById('wtt');
	let wtsb = document.getElementById('wtsb');

  // socket
  let socket = null;
  let SOCKET_CALLBACKS = {};


  SOCKET_CALLBACKS.onReceiveAirTower = ( towerEntry ) => {
    addToTower(AIR_TOWER, towerEntry);
		loadListUI('airTowerList', AIR_TOWER, 'airTower');
  };

	SOCKET_CALLBACKS.onReceiveWaterTower = ( towerEntry ) => {
    addToTower(WATER_TOWER, towerEntry);
		loadListUI('waterTowerList', WATER_TOWER, 'waterTower');
  };

  SOCKET_CALLBACKS.onLoadAirTower = ( airTower ) => {
		AIR_TOWER = airTower;
		loadListUI('airTowerList', AIR_TOWER, 'airTower');
  };
	SOCKET_CALLBACKS.onLoadWaterTower = ( waterTower ) => {
		WATER_TOWER = waterTower;
		loadListUI('waterTowerList', WATER_TOWER, 'waterTower');
  };

  SOCKET_CALLBACKS.onConnected =  () => {

  };

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


  let connect = () => {
    if ( socket ) {
      return;
    }

    socket = io.connect( SERVER.url );

    socket.on( 'connected', SOCKET_CALLBACKS.onConnected );
    socket.on( 'loadAirTower' , SOCKET_CALLBACKS.onLoadAirTower );
    socket.on( 'loadWaterTower' , SOCKET_CALLBACKS.onLoadWaterTower );
    socket.on( 'receiveAirTower', SOCKET_CALLBACKS.onReceiveAirTower );
		socket.on( 'receiveWaterTower', SOCKET_CALLBACKS.onReceiveWaterTower );


  };

  let sendAirTower = () => {
    if ( !socket ) {
      return;
		}

    socket.emit('airTower', {
			wo: atwo.value,
			pid: atpid.value,
			desc: atdesc.value,
			time: att.valueAsNumber,
			exitTime: att.valueAsNumber + (125 * MINUTE) + MINUTE
    });
    clearInputs()
  };

	let sendWaterTower = () => {
		if ( !socket ) {
			return;
		}

		socket.emit('waterTower', {
			wo: wtwo.value,
			pid: wtpid.value,
			desc: wtdesc.value,
			time: wtt.valueAsNumber,
			exitTime: wtt.valueAsNumber + (120 * MINUTE) + MINUTE
		});
    clearInputs();
	};

  function clearInputs(){
    atwo.value = '';
    atpid.value = '';
    atdesc.value = '';
    wtwo.value = '';
    wtpid.value = '';
    wtdesc.value = '';
  }

	atsb.addEventListener('click', sendAirTower );
	wtsb.addEventListener('click', sendWaterTower);

  function createTowerEntry( message ) {
    let towerEntry = document.createElement('div');
    return towerEntry;
  };

	function loadListUI(id, data, tower){
		let list = TL[id];
		list.innerHTML = "";

		for (let i = 0; i < data.length; i++) {
      let entry = data[i];
			let listItem = document.createElement('div');
			listItem.className = "listItem";

			let wo = document.createElement('div');
			let pid = document.createElement('div');
			let desc = document.createElement('div');
			let time = document.createElement('div');
			let exitTime = document.createElement('div');
      let deleteButton = document.createElement('img');

      deleteButton.addEventListener('click', function(){
        delteEntry(i, tower);
      });

			wo.className = "wo";
			pid.className = "pid";
			desc.className = "desc";
			time.className = "time";
			exitTime.className = "exitTime";
      deleteButton.className = "deleteButton";

			wo.innerText = entry.wo;
			pid.innerText = entry.pid;
			desc.innerText = entry.desc;
			time.innerText = formatDateTime(entry.time);
			exitTime.innerText = formatTime(getTimeLeft(entry));
      deleteButton.src = "./img/baseline-delete-24px.svg";

			listItem.appendChild(wo);
			listItem.appendChild(pid);
			listItem.appendChild(desc);
			listItem.appendChild(time);
			listItem.appendChild(exitTime);
      listItem.appendChild(deleteButton);

			list.appendChild(listItem);
		}
		console.log(`Loaded ${id}`);
	}
	function getTimeAsNumber(){
		return Date.now();
	}

	function getTimeLeft( item ){
		let exitTime = item.exitTime;
		let now = getTimeAsNumber() - 8 * HOUR;
		let timeLeft = exitTime - now;

		return timeLeft;
	}
	function updateTimerUI(id, data){
		let list = TL[id];

		for (let i = 0; i < data.length; i++) {
			let item = data[i];
			let timeLeft = getTimeLeft( item );
			let listItem = list.getElementsByClassName('listItem')[i];
			let exitTimeEl = listItem.getElementsByTagName('div')[4];
			exitTimeEl.innerText = formatTime( timeLeft > 0 ? timeLeft : 0 );
		}
	}

  function delteEntry(i, tower){
    let t = null;
    if (tower == 'waterTower') {
      t = WATER_TOWER;
    }else if( tower == 'airTower'){
      t = AIR_TOWER;
    }

    let item = t[i];
    let c = confirm(`Are you sure you want to delete ${item.wo}`)

    if (c) {
      socket.emit('deleteEntry', {
        index: i,
        towerName: tower
      });
    }

  }

	setInterval(function(){
		updateTimerUI('waterTowerList', WATER_TOWER);
		updateTimerUI('airTowerList', AIR_TOWER);
	}, 1000);

	return {
		connect: connect
	}
})();
KCTC.connect();
