import React from "react";
import { Link } from "react-router-dom";

import "../styles/route-button.css";

const RouteButton = ({ navTo, icon, iconText, type }) => {
	return (
		<div className={["route-button", type ? type : ""].join(" ")}>
			<Link to={navTo} className="nav-button">
				<div className="nav-button-icon">
					<i className="material-icons">{icon}</i>
				</div>
				<div className="nav-button-text">{iconText}</div>
			</Link>
		</div>
	);
};

export default RouteButton;
