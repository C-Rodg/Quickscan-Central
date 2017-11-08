// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

// Default timeout for requests to Electron wrapper
const DEFAULT_TIMEOUT = 10000;

// Get Device - scans, time, info
export const getDevice = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-device");
		ipcRenderer.once("get-device-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Clear the device with new time
export const clearDevice = timeTuple => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("clear-device", timeTuple);
		ipcRenderer.once("clear-device-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Upload barcode data
export const uploadData = scanObj => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("upload-device", scanObj);
		ipcRenderer.once("upload-device-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};
