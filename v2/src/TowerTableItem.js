import React, {Component} from 'react';
import {DateTime} from 'luxon';
import './css/TowerTableItem.css';


class TowerTableItem extends Component {

	constructor(){
		super();

		this.timerUpdateInterval = setInterval(() => {
			this.setState({
				timeLeft: this.getTimeLeft()
			});
		}, 500);
	}

	componentWillUnmount(){
		clearInterval(this.timerUpdateInterval);
	}

	render(){
		this.state = {
			timeLeft: this.getTimeLeft()
		};
		return (
			<div className={this.state.timeLeft <= 5 * 60000 ? 'listItem outOfTime' : 'listItem'}>
				<div className='wo'>{this.props.item.wo}</div>
				<div className="pid">{this.props.item.pid}</div>
				<div className="desc">{this.props.item.desc}</div>
				<div className="time">{this.formatDateTime(this.props.item.time)}</div>
				<div className="exitTime">{this.formatDateTime(this.props.item.exitTime)}</div>
				<div className="timer">{this.state.timeLeft <= 0 ? this.formatTime(0) : this.formatTime(this.state.timeLeft)}</div>
				<img src="./img/baseline-delete-24px.svg" alt="X" className="deleteButton" onClick={() => {
					if (this.props.isTowerRunning) {
						this.props.deleteEntry(this.props.index, this.props.towerName);
					}
					else {
						alert('Cannot delete while tower is paused');
					}
				}}></img>
			</div>
		)
	}
	getTimeLeft(){
		let exitTime = this.props.item.exitTime;
		let now = Date.now();
		let timeLeft = exitTime - now;
		return timeLeft;
	}

	formatDateTime(t){
		let date = DateTime.fromMillis(t);
		let dstr = date.toISO().substr(0,16).replace('T', ' ');
		return dstr;
	}
	formatTime( t ){
		let SECOND = 1000;
		let MINUTE = 60 * SECOND;


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
