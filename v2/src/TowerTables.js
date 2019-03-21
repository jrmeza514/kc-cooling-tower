import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TowerTable from './TowerTable';

const styles = {

}
class TowerTables extends Component{
	render(){
		return (
		<Grid container spacing={24}>
			<Grid item xs={12} lg={6}>
				<TowerTable towerTitle="Water Tower" items={this.props.towers.WATER_TOWER} deleteEntry={this.props.deleteEntry}
				towerName="waterTower" isRunning={this.props.waterTowerRunning} togglePowerState={this.props.toggleWaterTowerPowerState}/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<TowerTable towerTitle="Air Tower" items={this.props.towers.AIR_TOWER} deleteEntry={this.props.deleteEntry}
				towerName="airTower" isRunning={this.props.airTowerRunning} togglePowerState={this.props.toggleAirTowerPowerState}/>
			</Grid>
		</Grid>
		)
	}
}

TowerTables.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TowerTables);
