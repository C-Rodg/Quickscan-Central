import React from "react";
import { Link } from "react-router-dom";

import "../styles/float-button.css";
import "../styles/home-button.css";

const HomeButton = () => {
	return (
		<Link to="/" className="home-button float-button">
			<i className="material-icons">home</i>
		</Link>
	);
};

export default HomeButton;
