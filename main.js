const {app, ipcMain: ipc} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const path = require('path');
const MainWindow = require('./main-window');
const Settings = require('./lib/settings');
const Storage = require('./lib/storage');
const Scheduler = require('./lib/scheduler');

const storage = new Storage(path.join(app.getPath('userData'), 'storage'));

app.whenReady().then(() => {
	const mainWindow = new MainWindow();
	const trayIcon = require('./lib/tray-icon');
	const settings = new Settings();
	const storage = new Storage(settings);
	const scheduler = new Scheduler(mainWindow, storage);

	ipc.handle('medications:get', () => storage.medications);
	ipc.on('medications:set', (_e, med) => storage.set(med));
	ipc.on('medications:remove', (_e, med) => storage.remove(med));

	ipc.handle('settings:get:storagePath', () => settings.storagePath);
	ipc.handle('settings:set:storagePath', (_e, path) => {
		const newPath = settings.setStoragePath(path);
		if (newPath) storage.save();
		return newPath;
	});

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
