import React from "react";

import RouteButton from "./RouteButton";

const Manage = () => {
	return (
		<div className="manage container center-flex">
			<RouteButton icon="edit" iconText="Edit" navTo="" type="warning" />
			<RouteButton icon="clear" iconText="Clear" navTo="" type="danger" />
		</div>
	);
};

export default Manage;
