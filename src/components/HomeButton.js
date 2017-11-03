import React from "react";
import { Link } from "react-router-dom";
import "../styles/home-button.css";

const HomeButton = () => {
	return (
		<Link to="/" className="home-button">
			<i className="material-icons">home</i>
		</Link>
	);
};

export default HomeButton;
