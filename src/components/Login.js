import React, { Component } from "react";
import "../styles/login.css";
import "../styles/input.css";

import HomeButton from "./HomeButton";

class Login extends Component {
	state = {
		pass: "",
		error: false
	};

	// Check password
	checkPassword = ev => {
		ev.preventDefault();
		if (this.state.pass === "9151") {
			this.props.onAuthenticate();
		} else {
			this.setState({ error: true });
		}
	};

	render() {
		return (
			<div className="login container center-flex">
				<div className="card">
					<h1 className="card-title">Login</h1>
					<form onSubmit={this.checkPassword}>
						<div className="input-container">
							<input
								autoFocus
								type="password"
								id="data-password"
								required="required"
								value={this.state.pass}
								onChange={ev => this.setState({ pass: ev.target.value })}
							/>
							<label htmlFor="data-password">Password</label>
							<div className="bar" />
						</div>
						{this.state.error && (
							<div className="password-error">Please try again...</div>
						)}
						<div className="button-container">
							<button type="submit">
								<span>Go</span>
							</button>
						</div>
					</form>
					<div className="edit-box">
						<i className="material-icons">edit</i>
					</div>
				</div>
				<HomeButton />
			</div>
		);
	}
}

export default Login;
