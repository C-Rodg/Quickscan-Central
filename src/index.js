import React from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

render(
	<HashRouter>
		<div>Testttt</div>
	</HashRouter>,
	document.getElementById("root")
);
