import React, { Component } from 'react';
import './css/App.css';
import AppHeader from './AppHeader';
import PropTypes from 'prop-types';
import TowerForms from './TowerForms';
import TowerTables from './TowerTables';
import { withStyles } from '@material-ui/core/styles';
import openSocket from 'socket.io-client';

const styles = {
	contentContainer: {
		padding: '16px',
	}
}

class App extends Component {

	constructor(){
		super();
		this.state = {
			towers: {
				AIR_TOWER: [],
				WATER_TOWER: []
			},
			isFormVisible: JSON.parse(localStorage.getItem('isFormVisible'))
		};

		this.socket = openSocket('http://localhost:8000');

    this.socket.on( 'loadAirTower' , ( airTower ) => {
			this.setState({
				towers: {
					WATER_TOWER: this.state.towers.WATER_TOWER,
					AIR_TOWER: airTower
				}
			});
			console.log(this.state.towers.AIR_TOWER);
			this.setState(this.state);
	  });

    this.socket.on( 'loadWaterTower' , ( waterTower ) => {
			this.setState({
				towers: {
					WATER_TOWER: waterTower,
					AIR_TOWER: this.state.towers.AIR_TOWER
				}
			});
			console.log(this.state.towers.WATER_TOWER);
			this.setState(this.state);
	  });

    this.socket.on( 'receiveAirTower', ( towerEntry ) => {
	    this.addToTower(this.state.towers.AIR_TOWER, towerEntry);
			this.setState(this.state);
	  });

	  this.socket.on( 'receiveWaterTower', ( towerEntry ) => {
	    this.addToTower(this.state.towers.WATER_TOWER, towerEntry);
			this.setState(this.state);
	  });
	}

	addToTower(tower, item){
		if (tower.length === 0 ) {
			tower.push(item);
			return;
		}
		if (item.time >= tower[tower.length - 1].time) {
			tower.push(item);
		}
		if (tower.length === 1 ) {
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

	sendTower( towerName, entry){
		this.socket.emit(towerName, entry);
	}

	deleteEntry(i, tower){
    let t = null;
    if (tower === 'waterTower') {
      t = this.state.towers.WATER_TOWER;
    }else if( tower === 'airTower'){
      t = this.state.towers.AIR_TOWER;
    }

    let item = t[i];
		//eslint-disable-next-line
    let c = confirm(`Are you sure you want to delete ${item.wo}`)

    if (c) {
      this.socket.emit('deleteEntry', {
        index: i,
        towerName: tower
      });
    }

  }

  render() {
    return (
      <div>
        <AppHeader toggleFormVisibility={this.toggleFormVisibility.bind(this)}/>
        <div className={this.props.classes.contentContainer}>
          <TowerForms sendTower={this.sendTower.bind(this)} isFormVisible={this.state.isFormVisible}/>
          <TowerTables towers={this.state.towers} deleteEntry={this.deleteEntry.bind(this)}/>
        </div>
      </div>
    );
  }

	toggleFormVisibility(){
		let isFormVisible = !this.state.isFormVisible;
		this.setState({ isFormVisible: isFormVisible});
		localStorage.setItem('isFormVisible', isFormVisible);
	}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
