import React, { Component } from "react";
import { Portal } from "react-portal";
import "../styles/portal.css";

import TextInput from "./TextInput";

class AddScanPortal extends Component {
	state = {
		scanToAdd: ""
	};

	handleSubmit = ev => {
		ev.preventDefault();
		this.props.onConfirmAdd(this.state.scanToAdd);
	};

	render() {
		return (
			<Portal>
				<div className="portal add-item-portal">
					<div className="card">
						<form onSubmit={this.handleSubmit}>
							<div className="portal-body">
								<div className="portal-title">
									What data would you like to insert after the selected barcode?
								</div>
								<div className="add-content">
									<TextInput
										val={this.state.scanToAdd}
										tag="scanToAdd"
										label="Scan Data"
										valChange={(tag, ev) =>
											this.setState({ scanToAdd: ev.target.value })}
									/>
								</div>
							</div>
							<div className="portal-actions add-actions">
								<div
									className="portal-cancel portal-action"
									onClick={this.props.onCancel}
								>
									Cancel
								</div>
								<div
									className="portal-confirm portal-action"
									onClick={() => this.props.onConfirmAdd(this.state.scanToAdd)}
								>
									Insert Scan
								</div>
							</div>
						</form>
					</div>
				</div>
			</Portal>
		);
	}
}

export default AddScanPortal;
