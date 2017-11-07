import React from "react";

import "../styles/scan-list-item.css";

const ScanListItem = ({
	idx,
	scanId,
	scanTime,
	isScanCode,
	openActionButtons,
	onActionClick,
	isOpen
}) => {
	return (
		<div
			className={["scan-list-item", isScanCode ? "is-scan-code" : ""].join(" ")}
		>
			<div className="scan-item-content">
				<div
					className="more-item-info icon-card-hover"
					onClick={() => openActionButtons(idx)}
				>
					<i className="material-icons">more_horiz</i>
				</div>
				<div className="item-id">{scanId}</div>
				<div className="item-time">{scanTime}</div>
			</div>
			<div className={["scan-item-actions", isOpen ? "is-open" : ""].join(" ")}>
				<i
					className="material-icons action-icon remove"
					onClick={() => onActionClick(false, idx)}
				>
					remove_circle_outline
				</i>
				<i
					className="material-icons action-icon add"
					onClick={() => onActionClick(true, idx)}
				>
					add_circle_outline
				</i>
			</div>
		</div>
	);
};

export default ScanListItem;
