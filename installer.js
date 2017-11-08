const electronInstaller = require("electron-winstaller");

resultPromise = electronInstaller.createWindowsInstaller({
	appDirectory: "./builds/QuickscanCentral",
	outputDirectory: "./builds/QuickscanCentralInstaller",
	exe: "QuickscanCentral.exe",
	version: "1.0.1",
	setupIcon: "./src/static/favicon.ico"
});

resultPromise.then(
	() => console.log("Build Complete!"),
	e => console.log(e.message)
);

// set DEBUG=electron-windows-installer:main && node installer.js
