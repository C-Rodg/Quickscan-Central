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
