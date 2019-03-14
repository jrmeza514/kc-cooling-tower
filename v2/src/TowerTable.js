import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import theme from './Theme';
import TowerTableItem from './TowerTableItem';
import './css/TowerTable.css';

const styles = {
	tableContainer: {
		width: '100%',
		backgroundColor: theme.palette.primary.main,
		paddingBottom: '8px'
	},
	tableHeader: {
		width: '100%',
		color: 'white',
		padding: '8px'
	},
	tableBody: {
		backgroundColor: 'white',
		minHeight: '36px'
	}
}
class TowerTable extends Component{

	render(){
		const items = this.props.items;
		const listItems = items.map((item, index) =>
			<TowerTableItem className="tableItem" item={item} key={index} towerName={this.props.towerName} index={index} deleteEntry={this.props.deleteEntry}/>
		);

		return (
			<Grid container spacing={16}>
				<Grid item xs={12}>
					<div className='towerTitle'>{this.props.towerTitle}</div>
					<div className={this.props.classes.tableContainer + " tableContainer"}>
						<div className={this.props.classes.tableHeader}>
							<div className="wo">WO #</div>
							<div className="pid">PID</div>
							<div className="desc">Description</div>
							<div className="time">Time In</div>
							<div className="exitTime">Time Out</div>
							<div className="timer">Time Left</div>
						</div>
						<div className={this.props.classes.tableBody}>
							{listItems}
						</div>
					</div>
				</Grid>
			</Grid>
		)
	}
}

TowerTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TowerTable);
