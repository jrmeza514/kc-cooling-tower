import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import theme from './Theme';
import './css/TowerTableItem.css';


class TowerTableItem extends Component {

	constructor(){
		super();
		setInterval(() => {
			this.setState({
				timeLeft: this.getTimeLeft()
			});
		}, 1000);
	}

	render(){
		this.state = {
			timeLeft: this.getTimeLeft()
		};
		return (
			<div className={this.state.timeLeft <= 0 ? 'listItem outOfTime' : 'listItem'}>
				<div className='wo'>{this.props.item.wo}</div>
				<div className="pid">{this.props.item.pid}</div>
				<div className="desc">{this.props.item.desc}</div>
				<div className="time">{this.formatDateTime(this.props.item.time)}</div>
				<div className="exitTime">{this.formatDateTime(this.props.item.exitTime)}</div>
				<div className="timer">{this.state.timeLeft <= 0 ? this.formatTime(0) : this.formatTime(this.state.timeLeft)}</div>
				<img src="./img/baseline-delete-24px.svg" className="deleteButton" onClick={() => {this.props.deleteEntry(this.props.index, this.props.towerName)}}></img>
			</div>
		)
	}
	getTimeLeft(){
		let SECOND = 1000;
		let MINUTE = 60 * SECOND;
		let HOUR = MINUTE * 60;
		let DAY = HOUR * 24;
		let exitTime = this.props.item.exitTime;
		let now = Date.now() - 8 * HOUR;
		let timeLeft = exitTime - now;
		return timeLeft;
	}

	formatDateTime(t){
		let SECOND = 1000;
		let MINUTE = 60 * SECOND;
		let HOUR = MINUTE * 60;
		let DAY = HOUR * 24;

		let date = new Date();
		date.setTime(t + 8 * HOUR);
		let dstr = date.toLocaleDateString();
		let hr = date.getHours();
		let min = date.getMinutes();

		if(hr < 10) hr = '0' + hr;
		if(min < 10) min = '0' + min;

		let v = dstr + ' ' +hr + ":" + min;
		return v;
	}
	formatTime( t ){
		let SECOND = 1000;
		let MINUTE = 60 * SECOND;
		let HOUR = MINUTE * 60;
		let DAY = HOUR * 24;


		let mins = t / MINUTE;
		let hrs = mins / 60;;
		let secs = t / SECOND;
		let hr = Math.floor(hrs);
		let min = Math.floor((hrs - hr) * 60);
		let sec = Math.floor(secs % 60);
		if(hr < 10) hr = '0' + hr;
		if(min < 10) min = '0' + min;
		if (sec < 10) sec = '0' + sec;
		let v = hr + ":" + min + ':' + sec;
		return v;
	}
}

export default TowerTableItem;
