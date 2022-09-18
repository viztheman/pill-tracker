const {app, BrowserWindow, Tray, Menu, nativeImage, ipcMain: ipc} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const path = require('path');
const Settings = require('./lib/settings');
const Storage = require('./lib/storage');
const Scheduler = require('./lib/scheduler');

const storage = new Storage(path.join(app.getPath('userData'), 'storage'));

function createWindow() {
	const mainWindow = new BrowserWindow({
         width: 800,
         height: 600,
         webPreferences: {
             preload: path.join(__dirname, 'preload.js')
         }
     });

     mainWindow.loadFile(path.join(__dirname, 'views', 'index.html'));
     return mainWindow;
}

function createTrayIcon() {
}

app.whenReady().then(() => {
	const mainWindow = createWindow();
	const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
	const trayIcon = new Tray(icon);

	const contextMenu = Menu.buildFromTemplate([
		{label: 'Pill Tracker', enabled: false},
		{type: 'separator'},
		{label: 'Show App', click: () => mainWindow.show()},
		{type: 'separator'},
		{label: 'Export...', click: () => storage.export()},
		{label: 'Import...', click: () => {
			storage.import();
			ipc.refresh(storage.medications);
		}},
		{type: 'separator'},
		{label: 'Reset', click: () => {
			storage.reset();
			ipc.refresh(storage.medications);
		}},
		{type: 'separator'},
		{role: 'quit'}
	]);
	trayIcon.setContextMenu(contextMenu);
	trayIcon.setToolTip('Pill Tracker');
	trayIcon.setTitle('Pill Tracker');

	const settings = new Settings();
	const storage = new Storage(settings);
	const scheduler = new Scheduler(mainWindow, storage);

	ipc.handle('medications:get', () => storage.medications);
	ipc.handle('medications:set', (_e, med) => storage.set(med));
	ipc.on('medications:remove', (_e, med) => storage.remove(med));

	ipc.handle('settings:get:useCloudStorage', () => settings.useCloudStorage);
	ipc.on('settings:set:useCloudStorage', (_e, useCloud) => {
		settings.useCloudStorage = useCloud;
		storage.save();
	});
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
