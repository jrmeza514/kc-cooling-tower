import React, { Component } from 'react';
import './css/App.css';
import AppHeader from './AppHeader';
import PropTypes from 'prop-types';
import TowerForms from './TowerForms';
import TowerTables from './TowerTables';
import { withStyles } from '@material-ui/core/styles';
import openSocket from 'socket.io-client';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
const styles = {
	contentContainer: {
		padding: '16px',
	},
	list: {
		width: 250
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
			isFormVisible: JSON.parse(localStorage.getItem('isFormVisible')),
			WATER_TOWER_RUNNING: true,
			AIR_TOWER_RUNNING: true,
			drawerOpen: false
		};

		this.socket = openSocket('https://kc-cooling-tower.herokuapp.com/');
		// this.socket = openSocket('http://localhost:8000/');

		this.socket.on('loadAirTowerPowerState', (isRunning) => {
			this.setState({
				AIR_TOWER_RUNNING: isRunning
			});
		});

		this.socket.on('loadWaterTowerPowerState', (isRunning) => {
			this.setState({
				WATER_TOWER_RUNNING: isRunning
			});
		});

    this.socket.on( 'loadAirTower' , ( airTower ) => {
			this.setState({
				towers: {
					WATER_TOWER: this.state.towers.WATER_TOWER,
					AIR_TOWER: airTower
				}
			});
			this.setState(this.state);
	  });

    this.socket.on( 'loadWaterTower' , ( waterTower ) => {
			this.setState({
				towers: {
					WATER_TOWER: waterTower,
					AIR_TOWER: this.state.towers.AIR_TOWER
				}
			});
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
        <AppHeader toggleFormVisibility={this.toggleFormVisibility.bind(this)} toggleDrawer={this.toggleDrawer.bind(this)}/>
				<Drawer open={this.state.drawerOpen}  onClose={()=>{this.toggleDrawer(false)}}>
          <div tabIndex={0} role="button" onClick={()=>{this.toggleDrawer(false)}}>
					<List className={this.props.classes.list}>
						<ListItem button key="toggleFormVisibility" onClick={this.toggleFormVisibility.bind(this)}>
							<ListItemIcon>
								{
									this.state.isFormVisible ? <VisibilityOffIcon/> : <VisibilityIcon/>
								}
							</ListItemIcon>
							<ListItemText primary={this.state.isFormVisible ? "Hide Form" : "Show Form"} />
						</ListItem>
						<ListItem button key="toggleWaterTowerPowerState" onClick={this.toggleWaterTowerPowerState.bind(this)}>
              <ListItemIcon><PowerIcon/></ListItemIcon>
              <ListItemText primary={this.state.WATER_TOWER_RUNNING ? "Stop Water Tower" : "Start Water Tower"} />
            </ListItem>
            <ListItem button key="toggleAirTowerPowerState" onClick={this.toggleAirTowerPowerState.bind(this)}>
              <ListItemIcon><PowerIcon/></ListItemIcon>
              <ListItemText primary={this.state.AIR_TOWER_RUNNING ? "Stop Air Tower" : "Start Air Tower"} />
            </ListItem>
	        </List>
          </div>
        </Drawer>
        <div className={this.props.classes.contentContainer}>
          <TowerForms sendTower={this.sendTower.bind(this)} isFormVisible={this.state.isFormVisible}/>
          <TowerTables towers={this.state.towers} deleteEntry={this.deleteEntry.bind(this)}
					toggleWaterTowerPowerState={this.toggleWaterTowerPowerState.bind(this)}
					toggleAirTowerPowerState={this.toggleAirTowerPowerState.bind(this)}
					waterTowerRunning={this.state.WATER_TOWER_RUNNING}
					airTowerRunning={this.state.AIR_TOWER_RUNNING}/>
        </div>
      </div>
    );
  }

	toggleFormVisibility(){
		let isFormVisible = !this.state.isFormVisible;
		this.setState({ isFormVisible: isFormVisible});
		localStorage.setItem('isFormVisible', isFormVisible);
	}
	toggleWaterTowerPowerState(){
		this.socket.emit('waterTowerPowerStateChange', !this.state.WATER_TOWER_RUNNING);
	}

	toggleAirTowerPowerState(){
		this.socket.emit('airTowerPowerStateChange', !this.state.AIR_TOWER_RUNNING);
	}
	toggleDrawer(open){
		this.setState({
			drawerOpen: open
		});
	}
}



App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
