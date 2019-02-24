let KCTC = ( () => {
  let AIR_TOWER = [];
	let WATER_TOWER = [];

  const SERVER = {
    connected: false,
    url: 'https://kc-cooling-tower.herokuapp.com'
  };

  // Workaround only for the purpose of browser-sync
  if (SERVER.url.indexOf("localhost")) {
    SERVER.url = "http://localhost:8000";
  }

  // socket
  let socket = null;
  let SOCKET_CALLBACKS = {};


  SOCKET_CALLBACKS.onReceiveAirTower = ( towerEntry ) => {
    AIR_TOWER.push( towerEntry );
  };

	SOCKET_CALLBACKS.onReceiveWaterTower = ( towerEntry ) => {
    WATER_TOWER.push( towerEntry );
  };

  SOCKET_CALLBACKS.onLoadAirTower = ( airTower ) => {
		AIR_TOWER = airTower;
		console.log(AIR_TOWER);
  };
	SOCKET_CALLBACKS.onLoadWaterTower = ( waterTower ) => {
		WATER_TOWER = waterTower;
		console.log(WATER_TOWER);
  };

  SOCKET_CALLBACKS.onConnected =  () => {

  };

  /*
    Initialize all UI COMPONENTS into constants for later use
  */
  // TODO: ADD UI


  /*
    Create the Click listener if user decides to connect
  */
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
      username: username,
      data: message
    });
  };

	let sendWaterTower = () => {
		if ( !socket ) {
			return;
		}

		socket.emit('waterTower', {
			username: username,
			data: message
		});
	};

	return {
		connect: connect
	}

  function createTowerEntry( message ) {
    let towerEntry = document.createElement('div');
    return towerEntry;
  };
})();
KCTC.connect();
