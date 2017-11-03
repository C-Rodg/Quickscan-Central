import React from "react";
import { Link } from "react-router-dom";

import RouteButton from "./RouteButton";

const Home = () => {
	return (
		<div className="home container center-flex">
			<RouteButton icon="file_upload" iconText="Upload" navTo="/upload" />
			<RouteButton
				icon="settings"
				iconText="Manage"
				navTo="/manage"
				type="success"
			/>
		</div>
	);
};

export default Home;
