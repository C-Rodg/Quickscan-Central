import React from "react";

import HomeButton from "./HomeButton";
import "../styles/upload.css";

// Display unique scans
const getUniqueText = scans => {
	if (scans && scans.size) {
		return scans.size !== 1 ? `${scans.size} scans` : `1 scan`;
	} else {
		return "0 scans";
	}
};

// Display Session Scans
const getSessionScans = scans => {
	if (scans && scans.size) {
		return (
			"Yes - " +
			(scans.size !== 1 ? `${scans.size} scans` : `${scans.size} scan`)
		);
	} else {
		return "No";
	}
};

const Upload = ({ onUpload, extraInfo, deviceInfo }) => {
	return (
		<div className="upload container">
			<div className="row">
				<div className="card">
					<div className="card-title">Scan Information:</div>
					<div className="card-row">
						<span className="card-info-title">Total Scans:</span>
						<span className="card-info-answer">
							{(extraInfo.totalScans || "0") +
								(extraInfo.totalScans !== 1 ? " scans" : " scan")}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Unique Scans:</span>
						<span className="card-info-answer">
							{getUniqueText(extraInfo.uniqueScans)}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">First Scan:</span>
						<span className="card-info-answer">
							{extraInfo.firstScan || "-No Scan Data-"}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Last Scan:</span>
						<span className="card-info-answer">
							{extraInfo.lastScan || "-No Scan Data-"}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Session Scans Present?</span>
						<span className="card-info-answer">
							{getSessionScans(extraInfo.sessionScans)}
						</span>
					</div>
				</div>

				<div className="card">
					<div className="card-title">Device Information:</div>
					<div className="card-row">
						<span className="card-info-title">Device ID:</span>
						<span className="card-info-answer">
							{deviceInfo.device || "-No Device Info-"}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Device Time:</span>
						<span className="card-info-answer">
							{extraInfo.displayDeviceTime || "-No Device Info-"}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Local Time:</span>
						<span className="card-info-answer">
							{extraInfo.displayCurrentTime || "-No Device Info-"}
						</span>
					</div>
					<div className="card-row">
						<span className="card-info-title">Clock Drift:</span>
						<span className="card-info-answer">
							{extraInfo.calculatedClockDrift || "-No Clock Information-"}
						</span>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="action-button upload-action-button" onClick={onUpload}>
					Upload Now!
				</div>
			</div>
			<HomeButton />
		</div>
	);
};

export default Upload;
