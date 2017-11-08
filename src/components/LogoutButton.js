import React from "react";

import "../styles/float-button.css";
import "../styles/logout-button.css";

const LogoutButton = ({ cb }) => {
	return (
		<div className="float-button logout-button" onClick={cb}>
			<i className="material-icons">exit_to_app</i>
		</div>
	);
};

export default LogoutButton;
