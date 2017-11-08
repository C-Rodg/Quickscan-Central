// Imports
const electron = require("electron");
const { ipcMain } = electron;
const Serialport = require("serialport");
const moment = require("moment");
const axios = require("axios");

// Settings/Utilities
const opnUtils = require("./opn-utils");
const { generateSOAP } = require("./upload-utils");

let currentCom = null;

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

		// Set Global Current ComName
		currentCom = selectedPort.comName;

		getDeviceInformation(selectedPort.comName, event, "get-device-response");
	});
});

// Event - upload device
ipcMain.on("upload-device", (event, arg) => {
	const postData = generateSOAP(arg.deviceId, arg.barcodes);

	axios({
		method: "post",
		url:
			"https://portal.validar.com/WebServices/V2/RemoteDataAcquirer/RemoteDataAcquirerService.asmx",
		headers: {
			"Content-Type": "text/xml; charset=utf-8",
			SOAPAction:
				"https://portal.validar.com/PortalWebServices/V2/RemoteDataAcquirer/UploadRemoteData",
			Host: "portal.validar.com"
		},
		data: postData
	})
		.then(resp => {
			event.sender.send("upload-device-response", resp);
		})
		.catch(err => {
			event.sender.send("upload-device-response", err);
		});
});

// Event - clear device
ipcMain.on("clear-device", (event, arg) => {
	// OPN Commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device
	const clearCodes = new Buffer([0x02, 0x02, 0x00, 0x9f, 0x2e]); // Clear existing codes

	let port = new Serialport(currentCom, {
		baudRate: 9600,
		dataBits: 8,
		parity: "odd",
		stopBits: 1,
		parser: Serialport.parsers.raw
	});

	port.on("open", err => {
		if (err) {
			event.sender.send("clear-device-response", generateError(err.message));
			return false;
		}

		port.on("data", data => {
			const offset = parseInt(data[data.length - 3]);

			if (data.length === 23 && offset === 0) {
				// Handle wake command and send clear codes command
				port.write(clearCodes);
			} else if (data.length === 5 && offset === 0) {
				// Handle clear codes command and reset time

				// Factor in offset
				let timeToSet;
				if (arg.offset >= 0) {
					timeToSet = moment().add(arg.offset, "h");
				} else {
					timeToSet = moment().subtract(Math.abs(arg.offset), "h");
				}

				const resetTime = [
					0x09,
					0x02,
					0x06,
					timeToSet.second(),
					timeToSet.minute(),
					timeToSet.hour(),
					timeToSet.date(),
					timeToSet.month() + 1,
					timeToSet.year() - 2000,
					0x00
				];

				// Calculate CRC check for last two bytes
				const SymbolClass = new opnUtils.SymbolCrc16();
				const crcCheck = SymbolClass.CalcSymbolCrc16(
					resetTime,
					resetTime.length
				);
				resetTime.push(crcCheck.HiByte, crcCheck.LoByte);

				// Create buffer and write
				const setTimeBuffer = new Buffer(resetTime);
				port.write(setTimeBuffer);
			} else if (data.length === 12 && offset === 0) {
				if (port && port.isOpen) {
					port.close(err => {
						if (err) {
							event.sender.send(
								"clear-device-response",
								generateError(err.message)
							);
						}
						event.sender.send("clear-device-response", { success: true });
					});
				} else {
					event.sender.send("clear-device-response", { success: true });
				}
			}
		});

		port.write(wake);
	});
});

// Get Device info
const getDeviceInformation = (com, event, responseName) => {
	// OPN Commands
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

	port.on("open", err => {
		if (err) {
			event.sender.send(responseName, generateError(err.message));
			return false;
		}
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
	});
};

// Handle Data for Wake
const parseDeviceInfo = data => {
	const serial = data.slice(4, 12).toString("hex");
	const sw_ver = data.slice(12, 20).toString();
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
