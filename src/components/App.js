// Imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AlertContainer from "react-alert";
import { withRouter } from "react-router";
import moment from "moment";

// Components & Styles
import "../styles/default.css";
import Title from "./Title";
import Home from "./Home";
import Login from "./Login";
import Manage from "./Manage";
import Clear from "./Clear";
import Edit from "./Edit";
import Upload from "./Upload";
import { alertOptions, shortAlert } from "../utils/alertOptions";
import {
	getClockDrift,
	quickDateFormat,
	displayDateFormat
} from "../utils/dateFormats";

// Services
import {
	getDevice,
	clearDevice,
	uploadData
} from "../services/container-services";

class App extends Component {
	state = {
		isAuthenticated: false,
		deviceTime: {},
		deviceInfo: {},
		barcodes: [],
		extraInfo: {}
	};

	// Get device info for selected routes
	componentWillReceiveProps(nextProps) {
		const { location: { pathname } } = nextProps;
		if (this.props.location.pathname !== pathname) {
			if (
				pathname === "/upload" ||
				pathname === "/manage/clear" ||
				pathname === "/manage/edit"
			) {
				this.handleGetDevice();
			}
		}
	}

	// Reset Device Info
	resetCurrentDevice = () => {
		this.setState({
			currentDevice: null,
			deviceTime: {},
			deviceInfo: {},
			barcodes: [],
			extraInfo: {}
		});
	};

	// Authenticate
	authenticate = () => {
		this.setState({ isAuthenticated: true });
	};

	// Logout
	logout = () => {
		this.setState({ isAuthenticated: false });
	};

	// Clear Device Confirmed
	handleClearDevice = resetTime => {
		const timeTuple = [
			resetTime.second(),
			resetTime.minute(),
			resetTime.hour(),
			resetTime.date(),
			resetTime.month() + 1,
			resetTime.year() - 2000
		];
		console.log(timeTuple);
		clearDevice(timeTupe)
			.then(data => {
				// TODO-Navigate home and clear state
				this.handleNotification({
					message: "Device initialized!",
					isShort: false,
					type: "success"
				});
			})
			.catch(err => {
				this.handleNotification({
					message: "Unable to initialize device..",
					isShort: false,
					type: "error"
				});
			});
	};

	// Upload Device
	handleUploadDevice = () => {
		// Invalid Device ID
		if (!this.state.deviceInfo.device) {
			this.handleNotification({
				message: "Invalid device ID...",
				type: "error",
				isShort: true
			});
			return false;
		}

		// No data
		if (!this.state.barcodes.length) {
			this.handleNotification({
				message: "No data to upload...",
				type: "error",
				isShort: true
			});
			return false;
		}

		// No internet
		if (!window.navigator.onLine) {
			this.handleNotification({
				message: "No internet connection...",
				type: "error",
				isShort: true
			});
			return false;
		}

		uploadDevice({
			barcodes: this.state.barcodes,
			deviceId: this.state.deviceInfo.device
		})
			.then(data => {
				// TODO - navigate back to home and reset state..
				this.handleNotification({
					message: "Successfully uploaded device!",
					isShort: false,
					type: "success"
				});
			})
			.catch(err => {
				this.handleNotification({
					message: "Unable to upload scans at this time..",
					isShort: false,
					type: "error"
				});
			});
	};

	// Notification system
	handleNotification = msgObj => {
		this.msg[msgObj.type](msgObj.message, msgObj.isShort ? shortAlert : {});
	};

	// Get Device information
	handleGetDevice = () => {
		getDevice()
			.then(data => {
				const { barcodes, info, time } = data;
				const extraInfo = this.calculateExtraInfo(data);
				console.log(data);
				this.setState({
					barcodes,
					deviceTime: time,
					deviceInfo: info,
					extraInfo
				});
			})
			.catch(err => {
				this.handleNotification({
					type: "error",
					isShort: true,
					message: err.message
				});
			});
	};

	// Calculate extra info
	calculateExtraInfo = data => {
		const calculatedClockDrift = data.time.clockDrift
			? getClockDrift(data.time.clockDrift)
			: "-Unknown Device Time";
		let uniqueScans = new Set(),
			uniqueSessions = new Set(),
			firstScan = "",
			lastScan = "",
			totalScans = 0,
			displayDeviceTime = "",
			displayCurrentTime = "";
		if (data.barcodes && data.barcodes.length > 0) {
			totalScans = data.barcodes.length;
			data.barcodes.forEach(code => {
				uniqueScans.add(code.data);
				if (code.data && code.data.indexOf("-SC-") > -1) {
					uniqueSessions.add(code.data);
				}
			});
			firstScan = moment(data.barcodes[0].time, quickDateFormat).format(
				displayDateFormat
			);
			lastScan = moment(
				data.barcodes[data.barcodes.length - 1].time,
				quickDateFormat
			).format(displayDateFormat);
		}
		if (data.time) {
			displayCurrentTime = moment(
				data.time.currentTime,
				quickDateFormat
			).format(displayDateFormat);
			displayDeviceTime = moment(data.time.deviceTime, quickDateFormat).format(
				displayDateFormat
			);
		}
		return {
			calculatedClockDrift,
			sessionScans: uniqueSessions,
			firstScan,
			lastScan,
			uniqueScans,
			totalScans,
			displayCurrentTime,
			displayDeviceTime
		};
	};

	// Insert scan
	handleInsertScan = (idx, scan) => {
		if (idx === -1) {
			this.setState({
				barcodes: [scan, ...this.state.barcodes]
			});
			return false;
		}
		const firstBarcodes = this.state.barcodes.slice(0, idx + 1);
		const lastBarcodes = this.state.barcodes.slice(idx + 1);
		this.setState({
			barcodes: [...firstBarcodes, scan, ...lastBarcodes]
		});
	};

	// Remove Scan
	handleRemoveScan = idx => {
		this.setState({
			barcodes: this.state.barcodes.filter((code, currentIdx) => {
				return currentIdx !== idx;
			})
		});
	};

	render() {
		return (
			<div className="app">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
				<Title />
				<main>
					<Route
						path="/"
						exact
						render={props => {
							return <Home {...props} />;
						}}
					/>

					<Route
						path="/upload"
						exact
						render={props => {
							return (
								<Upload
									{...props}
									onUpload={this.handleUploadDevice}
									extraInfo={this.state.extraInfo}
									deviceInfo={this.state.deviceInfo}
								/>
							);
						}}
					/>

					<Route
						path="/manage"
						exact
						render={props => {
							return this.state.isAuthenticated ? (
								<Manage {...props} />
							) : (
								<Login {...props} onAuthenticate={this.authenticate} />
							);
						}}
					/>

					<Route
						path="/manage/edit"
						exact
						render={props => {
							return (
								<Edit
									{...props}
									onUpload={this.handleUploadDevice}
									barcodes={this.state.barcodes}
									onAddScan={this.handleInsertScan}
									onConfirmedDelete={this.handleRemoveScan}
									onNotification={this.handleNotification}
								/>
							);
						}}
					/>

					<Route
						path="/manage/clear"
						exact
						render={props => {
							return (
								<Clear
									{...props}
									onClear={this.handleClearDevice}
									numScans={this.state.barcodes.length}
								/>
							);
						}}
					/>
				</main>
			</div>
		);
	}
}

export default withRouter(App);
