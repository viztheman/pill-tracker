const {app, Tray, Menu, nativeImage} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const path = require('path');
const MainWindow = require('./main-window');
const MedicationsIpc = require('./lib/medications-ipc');
const Storage = require('./lib/storage');
const Scheduler = require('./lib/scheduler');

const storage = new Storage(path.join(app.getPath('userData'), 'storage'));

app.whenReady().then(() => {
	const mainWindow = new MainWindow();
	const ipc = new MedicationsIpc(mainWindow, storage);
	const scheduler = new Scheduler(ipc, storage);

	const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
	const trayIcon = new Tray(icon);
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Pill Tracker', enabled: false},
		{type: 'separator'},
		{label: 'Show App', click: () => mainWindow.show()},
		{type: 'separator'},
		{label: 'Export', click: () => storage.export()},
		{type: 'separator'},
		{label: 'Reset', click: () => {
			storage.reset(true);
			ipc.refresh(storage.medications);
		}},
		{type: 'separator'},
		{role: 'quit'}
	]);
	trayIcon.setToolTip('Pill Tracker');
	trayIcon.setTitle('Pill Tracker');
	trayIcon.setContextMenu(contextMenu);

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
