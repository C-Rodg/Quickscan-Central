import React, { Component } from "react";
import moment from "moment";

import "../styles/edit.css";
import {
	quickDateFormat,
	addDateFormat,
	displayDateFormat
} from "../utils/dateFormats";
import HomeButton from "./HomeButton";
import Chart from "./Chart";
import ScanListItem from "./ScanListItem";

class Edit extends Component {
	state = {
		isShowingDeletePortal: false,
		isShowingAddPortal: false,
		editPosition: null,
		openPosition: null
	};

	// Get Scan Count header
	renderScanCount() {
		if (this.props.barcodes.length === 0) {
			return (
				<div className="no-scan-content scan-count">
					No Scans...<i
						className="material-icons scans-add"
						onClick={() =>
							this.setState({
								openPosition: null,
								editPosition: 0,
								isShowingAddPortal: true
							})}
					>
						add_circle_outline
					</i>
				</div>
			);
		}

		return (
			<div className="scan-count">
				{this.props.barcodes.length}{" "}
				{this.props.barcodes.length !== 1 ? "Scans" : "Scan"}{" "}
				<i className="material-icons scans-add">add_circle_outline</i>
			</div>
		);
	}

	// Open/Close Action Buttons
	openActionButtons = idx => {
		console.log("opening..");
		if (this.state.openPosition === idx) {
			this.setState({ openPosition: null });
		} else {
			this.setState({ openPosition: idx });
		}
	};

	// Handle Action Button Click
	handleActionClick = (isAdding, idx) => {
		if (isAdding) {
			this.setState({
				isShowingAddPortal: true,
				editPosition: idx,
				openPosition: null
			});
		} else {
			this.setState({
				isShowingDeletePortal: true,
				editPosition: idx,
				openPosition: null
			});
		}
	};

	// Get Scan List items
	renderScanList() {
		return this.props.barcodes.map((code, idx) => {
			const isScanCode = code.data.indexOf("-SC-") > -1 ? true : false;
			const displayTime = moment(code.time, quickDateFormat).format(
				displayDateFormat
			);
			const isOpen = this.state.openPosition === idx ? true : false;
			return (
				<ScanListItem
					key={code.time + code.data}
					idx={idx}
					scanId={code.data}
					scanTime={displayTime}
					isScanCode={isScanCode}
					openActionButtons={this.openActionButtons}
					isOpen={isOpen}
					onActionClick={this.handleActionClick}
				/>
			);
		});
	}

	// Display the scan chart
	renderScanChart() {
		const codesObject = {};
		this.props.barcodes.forEach(code => {
			const d = moment(code.time, quickDateFormat).format("YYYY-MM-DDTHH");
			if (codesObject.hasOwnProperty(d)) {
				codesObject[d] += 1;
			} else {
				codesObject[d] = 1;
			}
		});
		const barcodeData = Object.keys(codesObject)
			.map(k => {
				return {
					id: k,
					total: codesObject[k],
					time: moment(k, "YYYY-MM-DDTHH").format("h:00 a, MMM Do"),
					percent: Math.floor(codesObject[k] / this.props.barcodes.length * 100)
				};
			})
			.sort((a, b) => {
				if (
					moment(a.id, "YYYY-MM-DDTHH").isBefore(moment(b.id, "YYYY-MM-DDTHH"))
				) {
					return -1;
				} else if (
					moment(a.id, "YYYY-MM-DDTHH").isAfter(moment(b.id, "YYYY-MM-DDTHH"))
				) {
					return 1;
				} else {
					return 0;
				}
			});
		return <Chart title="Scan Time Summary" data={barcodeData} />;
	}

	// Get Scan Data and chart
	renderScanContent() {
		return (
			<div className="data-container">
				<div className="data-scans card">{this.renderScanList()}</div>
				<div className="data-chart card">{this.renderScanChart()}</div>
			</div>
		);
	}

	render() {
		return (
			<div className="edit container">
				<div className="row upload-button">
					{this.props.barcodes.length > 0 && (
						<div
							className="action-button upload-action-button"
							onClick={this.props.onUpload}
						>
							Upload Now!
						</div>
					)}
				</div>
				<div className="row count-container">{this.renderScanCount()}</div>
				<div className="row">
					{this.props.barcodes.length > 0 && this.renderScanContent()}
				</div>

				<HomeButton />
			</div>
		);
	}
}

export default Edit;
