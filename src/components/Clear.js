import React, { Component } from "react";

import HomeButton from "./HomeButton";
import "../styles/clear.css";

class Clear extends Component {
	render() {
		return (
			<div className="clear container">
				<div className="row">
					<div className="card">
						<div className="card-title">Device Information:</div>
						<div className="card-row">
							<span className="card-info-title">Total Scans:</span>
							<span className="card-info-answer">328 scans</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Unique Scans:</span>
							<span className="card-info-answer">302 scans</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">First Scan:</span>
							<span className="card-info-answer">4:22 am, Jun 28th, 2017</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Last Scan:</span>
							<span className="card-info-answer">7:22 pm, Oct 14th, 2017</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Session Scans Present?</span>
							<span className="card-info-answer">Yes (14 sessions)</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="action-button clear-action-button">Clear Device</div>
				</div>
				<HomeButton />
			</div>
		);
	}
}

export default Clear;
