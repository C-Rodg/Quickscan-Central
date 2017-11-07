// Imports
const electron = require("electron");
const { ipcMain } = electron;
const Serialport = require("serialport");
const moment = require("moment");
const axios = require("axios");

// Settings/Utilities
const opnUtils = require("./opn-utils");
const { generateSOAP } = require("./upload-utils");

// Event - get-device
ipcMain.on("get-device", (event, arg) => {
	Serialport.list((err, ports) => {
		if (err || !ports) {
			event.sender.send(
				"get-device-response",
				generateError("Unable to get serialport devices..")
			);
			return false;
		}

		// Connect to first OPN device
		for (let i = 0, j = ports.length; i < j; i++) {
			if (
				ports[i].manufacturer &&
				ports[i].manufacturer
					.replace(/\s/g, "")
					.toUpperCase()
					.indexOf("OPTOELECTRONICS") > -1
			) {
				selectedPort = ports[i];
				break;
			}
		}

		if (!selectedPort) {
			event.sender.send(
				"get-device-response",
				generateError("No opticon devices found..")
			);
			return false;
		}

		getDeviceInformation(selectedPort.comName, event, "get-device-response");
	});
});

// Get Device info
const getDeviceInformation = (com, event, responseName) => {
	// Basic commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device
	const clock = new Buffer([0x0a, 0x02, 0x00, 0x5d, 0xaf]); // Get Time
	const getCodes = new Buffer([0x07, 0x02, 0x00, 0x9e, 0x3e]); // Get Barcodes
	const clearCodes = new Buffer([0x02, 0x02, 0x00, 0x9f, 0x2e]); // Clear existing codes
	const powerDown = new Buffer([0x05, 0x02, 0x00, 0x5e, 0x9f]); // Shut the device down

	let port = new Serialport(com, {
		baudRate: 9600,
		dataBits: 8,
		parity: "odd",
		stopBits: 1,
		parser: Serialport.parsers.raw
	});

	const responseObject = {
		info: {
			device: "",
			firmware: ""
		},
		time: {
			deviceTime: "",
			currentTime: "",
			clockDrift: ""
		},
		barcodes: []
	};

	let barcodeData = new Uint8Array();

	port.on("data", data => {
		const offset = parseInt(data[data.length - 3]);

		if (data.length === 12 && offset === 0) {
			// Get Time
			responseObject.time = parseGetTime(data);
			port.write(getCodes);
		} else if (data.length === 23 && offset === 0) {
			// Device Wake
			const info = parseDeviceInfo(data);
			const newId = formatDeviceId(info.serial);
			if (!newId) {
				event.sender.send(responseName, generateError("Invalid Device Id.."));
				return false;
			}

			responseObject.info = { device: newId, firmware: info.sw_ver };
			port.write(clock);
		} else {
			// Get Barcodes
			barcodeData = opnUtils._appendBuffer(barcodeData, data);
			if (offset === 0) {
				let codes = barcodeData.slice(10, -3);

				let length = null,
					first = null,
					scan = null,
					symbology = null,
					detectedScans = [];

				while (codes) {
					length = parseInt(codes[0]);
					first = codes.slice(1, length + 1);
					barcodeData = codes.slice(length + 1);
					if (first.byteLength !== 0) {
						codes = codes.slice(length + 1);
						symbology = opnUtils.symbologies[first[0] || "UNKNOWN"];
						scan = Array.from(first.slice(1, first.length - 4))
							.map(x => String.fromCharCode(x))
							.join("");
						const scanDateTime = opnUtils.extractPackedTimestamp(
							first[first.length - 1],
							first[first.length - 2],
							first[first.length - 3],
							first[first.length - 4]
						);
						detectedScans.push({
							type: symbology,
							data: scan,
							time: scanDateTime
						});
					} else {
						codes = false;
					}
				}
				responseObject.barcodes = detectedScans;

				if (port && port.isOpen) {
					port.close(err => {
						if (err) {
							event.sender.send(responseName, generateError(err));
							return false;
						}
						event.sender.send(responseName, responseObject);
					});
				} else {
					event.sender.send(responseName, responseObject);
				}
			}
		}
	});

	port.write(wake);
};

// Handle Data for Wake
const parseDeviceInfo = data => {
	const serial = data.slice(4, 12);
	const sw_ver = data.slice(12, 20);
	return {
		serial,
		sw_ver
	};
};

// Handle Data for GetTime
const parseGetTime = data => {
	// Getting Time
	let s = data.slice(3, 4).toString();
	s = s.codePointAt(0);
	let min = data.slice(4, 5).toString();
	min = min.codePointAt(0);
	let hr = data.slice(5, 6).toString();
	hr = hr.codePointAt(0);
	let day = data.slice(6, 7).toString();
	day = day.codePointAt(0);
	let month = data.slice(7, 8).toString();
	month = month.codePointAt(0);
	let year = data.slice(8, 9).toString();
	year = year.codePointAt(0);
	year += 2000;

	const now = new Date();
	const deviceTime = new Date(year, month - 1, day, hr, min, s);

	const diff = now.getTime() - deviceTime.getTime();
	const secondsBetweenDates = Math.abs(diff / 1000);

	return {
		clockDrift: secondsBetweenDates,
		currentTime: now.toJSON(),
		deviceTime: deviceTime.toJSON()
	};
};

// HELPER - Format Device ID
const formatDeviceId = id => {
	if (typeof id === "string" && id[0] === "Q" && id.length >= 4) {
		return id;
	} else if (typeof id === "string" || typeof id === "number") {
		let strId = String(parseInt(id, 10));
		while (strId.length < 3) {
			strId = "0" + strId;
		}
		return `Q${strId}`;
	}
	return false;
};

// HELPER - Generate Error object
const generateError = msg => {
	return {
		error: true,
		message: msg
	};
};
