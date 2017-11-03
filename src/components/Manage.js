import React from "react";

import RouteButton from "./RouteButton";
import HomeButton from "./HomeButton";

const Manage = () => {
	return (
		<div className="manage container center-flex">
			<RouteButton
				icon="edit"
				iconText="Edit"
				navTo="/manage/edit"
				type="warning"
			/>
			<RouteButton
				icon="clear"
				iconText="Clear"
				navTo="/manage/clear"
				type="danger"
			/>
			<HomeButton />
		</div>
	);
};

export default Manage;
