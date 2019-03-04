import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
				<TowerTable towerTitle="Water Tower" items={this.props.towers.WATER_TOWER} deleteEntry={this.props.deleteEntry} towerName="waterTower"/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<TowerTable towerTitle="Air Tower" items={this.props.towers.AIR_TOWER} deleteEntry={this.props.deleteEntry} towerName="airTower"/>
			</Grid>
		</Grid>
		)
	}
}

TowerTables.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TowerTables);
