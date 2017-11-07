import React, { Component } from "react";
import moment from "moment";

import HomeButton from "./HomeButton";
import "../styles/clear.css";

class Clear extends Component {
	constructor() {
		super();
		this.state = {
			currentDate: moment(),
			offset: 0
		};
		this.interval = setInterval(this.updateDateTick, 1000);
	}

	// Clear timer
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	// Update the current date
	updateDateTick = () => {
		let currentDate;
		if (this.state.offset >= 0) {
			currentDate = moment().add(this.state.offset, "h");
		} else {
			currentDate = moment().subtract(Math.abs(this.state.offset), "h");
		}
		this.setState({
			currentDate
		});
	};

	// Add or subtract hour from device time
	modifyTime = isAdd => {
		const offset = isAdd ? this.state.offset + 1 : this.state.offset - 1;
		this.setState({
			offset
		});
	};

	render() {
		return (
			<div className="clear container">
				<div className="row">
					<div className="card">
						<div className="card-title">Initialization Settings:</div>
						<div className="card-row">
							<span className="card-info-answer">
								Are you sure you want to clear <b>ALL</b> data and reset the
								device time? This action cannot be undone.
							</span>
						</div>
						<div className="center-section">
							<div className="card-row">
								<span className="card-info-title">Scans to be Deleted:</span>
								<span className="card-info-answer">
									{this.props.numScans}{" "}
									{String(this.props.numScans) !== "1" ? "Scans" : "Scan"}
								</span>
							</div>
							<div className="card-row">
								<span className="card-info-title">New Device Time:</span>
								<span className="card-info-answer">
									{this.state.currentDate.format("h:mm:ss A, MMM Do, YYYY")}
								</span>
							</div>
							<div className="card-row mod-time">
								<span
									className="time-action"
									onClick={() => this.modifyTime(false)}
								>
									- 1 Hour
								</span>
								<span
									className="time-action"
									onClick={() => this.modifyTime(true)}
								>
									+ 1 Hour
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div
						className="action-button clear-action-button"
						onClick={() => this.props.onClear(this.state.currentDate)}
					>
						Clear Device
					</div>
				</div>
				<HomeButton />
			</div>
		);
	}
}

export default Clear;
