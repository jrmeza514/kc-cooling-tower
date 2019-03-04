import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TowerForm from './TowerForm';


class TowerForms extends Component{
	render(){
		return (
		<Grid container spacing={24} className={this.props.isFormVisible ? '' : 'hidden'}>
			<Grid item xs={12} lg={6}>
				<TowerForm towerName="Water Tower" timePickerId="dtpwtt" towerPrefix="wt" sendTower={this.props.sendTower} tower="waterTower"/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<TowerForm towerName="Air Tower" timePickerId="dtpatt" towerPrefix="at" sendTower={this.props.sendTower} tower="airTower"/>
			</Grid>
		</Grid>
		)
	}
}

export default TowerForms;
