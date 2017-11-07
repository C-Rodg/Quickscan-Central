// Imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AlertContainer from "react-alert";

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

	// Clear Device Confirmed
	clearDevice = resetTime => {
		console.log("New reset time is: " + resetTime);
		this.handleNotification({
			message: "Device initialized!",
			isShort: false,
			type: "success"
		});
	};

	// Notification system
	handleNotification = msgObj => {
		this.msg[msgObj.type](msgObj.message, msgObj.isShort ? shortAlert : {});
	};

	render() {
		console.log(this.state);
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
							return <Upload {...props} />;
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
							return <Edit {...props} />;
						}}
					/>

					<Route
						path="/manage/clear"
						exact
						render={props => {
							return <Clear {...props} onClear={this.clearDevice} />;
						}}
					/>
				</main>
			</div>
		);
	}
}

export default App;
