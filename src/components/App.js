// Imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AlertContainer from "react-alert";

// Components & Styles
import "../styles/default.css";
import { alertOptions, shortAlert } from "../utils/alertOptions";

// Services

class App extends Component {
	state = {
		isAuthenticated: false,

		currentDevice: null,
		deviceList: [],
		deviceTime: {},
		deviceInfo: {},
		barcodes: []
	};

	// Reset Device Info
	resetCurrentDevice = () => {
		this.setState({
			currentDevice: null,
			deviceTime: {},
			deviceInfo: {},
			barcodes: []
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

	// Notification system
	handleNotification = msgObj => {
		this.msg[msgObj.type](msgObj.message, msgObj.isShort ? shortAlert : {});
	};

	render() {
		return (
			<div className="app">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />

				<main />
			</div>
		);
	}
}
