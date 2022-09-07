const {app, ipcMain: ipc} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const path = require('path');
const MainWindow = require('./main-window');
const Settings = require('./lib/settings');
const Storage = require('./lib/storage');
const Scheduler = require('./lib/scheduler');

const storage = new Storage(path.join(app.getPath('userData'), 'storage'));

app.whenReady().then(() => {
	const trayIcon = require('./lib/tray-icon');
	const mainWindow = new MainWindow();
	const settings = new Settings();
	const storage = new Storage(settings);
	const scheduler = new Scheduler(mainWindow, storage);

	ipc.handle('medications:get', () => storage.medications);
	ipc.on('medications:set', (_event, medication) => storage.set(medication));
	ipc.on('medications:remove', (_event, medication) => storage.remove(medication));

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0)
		createWindow();
	});

	mainWindow.on('minimize', () => {
		if (trayIcon)
			return mainWindow.hide();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});
