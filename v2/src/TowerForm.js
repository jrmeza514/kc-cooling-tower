import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import './css/TowerForm.css';

class TowerForm extends Component{
	render(){
		return (
			<div className="towerForm card">
				<div className="formHeader">
					{this.props.towerName}
				</div>
				<div className="group">
					<input id={this.props.towerPrefix + "wo"} type="text" name="wo"/>
					<span className="highlight"></span>
					<span className="bar"></span>
					<label>Work Order Number</label>
				</div>
				<div className="group">
					<input id={this.props.towerPrefix + "pid"} type="text" name="pid"/>
					<span className="highlight"></span>
					<span className="bar"></span>
					<label>Product ID</label>
				</div>
				<div className="group">
					<input id={this.props.towerPrefix + "desc"} type="text" name="desc"/>
					<span className="highlight"></span>
					<span className="bar"></span>
					<label>Description</label>
				</div>

				<div className="group">
					<div className='input-group date' id={this.props.timePickerId}>
							<input type='text' className="form-control" />
							<span className="input-group-addon">
									<span className="glyphicon glyphicon-calendar"></span>
							</span>
					</div>
				</div>
				<input id={this.props.towerPrefix + 't'} type="datetime-local" hidden/>
				<button id="wtsb" type="button" className="btn" onClick={this.send.bind(this)}>Add</button>
			</div>
		)
	}

	send(){
		let SECOND = 1000;
		let MINUTE = 60 * SECOND;
		let HOUR = MINUTE * 60;
		let DAY = HOUR * 24;

		let wo = document.getElementById(this.props.towerPrefix + 'wo');
		let pid = document.getElementById(this.props.towerPrefix + 'pid');
		let desc = document.getElementById(this.props.towerPrefix + 'desc');
		let tt = document.getElementById(this.props.towerPrefix + 't');

		let entry = {
			wo: wo.value,
			pid: pid.value,
			desc: desc.value,
			time: tt.valueAsNumber,
			exitTime: tt.valueAsNumber + (120 * MINUTE)
		}

		this.props.sendTower(this.props.tower, entry);
		wo.value = "";
		pid.value = "";
		desc.value = "";
	}
}

export default TowerForm;
