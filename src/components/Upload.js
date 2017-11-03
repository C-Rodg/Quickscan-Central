import React, { Component } from "react";

import HomeButton from "./HomeButton";
import "../styles/upload.css";

class Upload extends Component {
	render() {
		return (
			<div className="upload container">
				<div className="row">
					<div className="card">
						<div className="card-title">Scan Information:</div>
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

					<div className="card">
						<div className="card-title">Device Information:</div>
						<div className="card-row">
							<span className="card-info-title">Device ID:</span>
							<span className="card-info-answer">Q0078275</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Device Time:</span>
							<span className="card-info-answer">3:22 pm, Nov 1st, 2017</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Local Time:</span>
							<span className="card-info-answer">3:25 am, Nov 1st, 2017</span>
						</div>
						<div className="card-row">
							<span className="card-info-title">Clock Drift:</span>
							<span className="card-info-answer">3 minutes, 10 seconds</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="upload-action-button">Upload Now!</div>
				</div>
				<HomeButton />
			</div>
		);
	}
}

export default Upload;
