import React from "react";
import { Link } from "react-router-dom";

import "../styles/home.css";
import RouteButton from "./RouteButton";

const Home = () => {
	return (
		<div className="home container">
			<div className="guide-text">
				Please ensure a Quickscan device is connected.
			</div>
			<div className="home-button-container center-flex">
				<RouteButton icon="file_upload" iconText="Confirm" navTo="/upload" />
				<RouteButton
					icon="settings"
					iconText="Manage"
					navTo="/manage"
					type="success"
				/>
			</div>
		</div>
	);
};

export default Home;
