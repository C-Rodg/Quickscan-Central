// Create native window, control app life, communication to window
const electron = require("electron");
const { BrowserWindow, app } = electron;
// Other imports
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let dev = false;

// Squirrel AutoUpdater/Packager
if (require("electron-squirrel-startup")) return;

if (handleSquirrelEvent()) {
	// squirrel event handled and app will exit in 1000ms, so don't do anything else
	return;
}

function handleSquirrelEvent() {
	if (process.argv.length === 1) {
		return false;
	}

	const ChildProcess = require("child_process");
	const path = require("path");

	const appFolder = path.resolve(process.execPath, "..");
	const rootAtomFolder = path.resolve(appFolder, "..");
	const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
	const exeName = path.basename(process.execPath);

	const spawn = function(command, args) {
		let spawnedProcess, error;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
		} catch (error) {}

		return spawnedProcess;
	};

	const spawnUpdate = function(args) {
		return spawn(updateDotExe, args);
	};

	const squirrelEvent = process.argv[1];
	switch (squirrelEvent) {
		case "--squirrel-install":
		case "--squirrel-updated":
			// Optionally do things such as:
			// - Add your .exe to the PATH
			// - Write to the registry for things like file associations and
			//   explorer context menus

			// Install desktop and start menu shortcuts
			spawnUpdate(["--createShortcut", exeName]);

			setTimeout(app.quit, 1000);
			return true;

		case "--squirrel-uninstall":
			// Undo anything you did in the --squirrel-install and
			// --squirrel-updated handlers

			// Remove desktop and start menu shortcuts
			spawnUpdate(["--removeShortcut", exeName]);

			setTimeout(app.quit, 1000);
			return true;

		case "--squirrel-obsolete":
			// This is called on the outgoing version of your app before
			// we update to the new version - it's the opposite of
			// --squirrel-updated

			app.quit();
			return true;
	}
}

// Electron Container Application Services
const services = require("./container/backend-services");

if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	dev = true;
}

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 730,
		show: false,
		//frame: false,
		//transparent: true,
		//fullscreen: true,
		resizable: true,
		minimizable: true,
		movable: true,
		closable: true,
		fullscreenable: true,
		title: "Quickscan Central",
		frame: true,
		icon: path.join(
			__dirname,
			"src",
			"static",
			"icons",
			"png",
			"quickscanIconOG.png_64x64.png"
		)
		//backgroundColor: '#00796b'
	});

	let indexPath;
	if (dev && process.argv.indexOf("--noDevServer") === -1) {
		indexPath = url.format({
			protocol: "http:",
			host: "localhost:8080",
			pathname: "index.html",
			slashes: true
		});
	} else {
		indexPath = url.format({
			protocol: "file:",
			pathname: path.join(__dirname, "dist", "index.html"),
			slashes: true
		});
	}

	mainWindow.loadURL(indexPath);

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		if (dev) {
			mainWindow.webContents.openDevTools();
		}
	});

	// Emitted when the window is closed.
	mainWindow.on("closed", function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	app.quit();
});

app.on("activate", function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
