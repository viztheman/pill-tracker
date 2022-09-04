const {app, Tray, Menu, nativeImage} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const MedicationsIpc = require('./server/medications-ipc');
const Storage = require('./server/storage');
const Scheduler = require('./server/scheduler');
const MainWindow = require('./server/main-window');

const storage = new Storage();

app.whenReady().then(() => {
	const mainWindow = new MainWindow();

	const trayIcon = new Tray('./icon.png');
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Pill Tracker', enabled: false},
		{type: 'separator'},
		{label: 'Show App', click: () => mainWindow.show()},
		{type: 'separator'},
		{role: 'quit'}
	]);
	trayIcon.setToolTip('Pill Tracker');
	trayIcon.setTitle('Pill Tracker');
	trayIcon.setContextMenu(contextMenu);

	const ipc = new MedicationsIpc(mainWindow, storage);
	const scheduler = new Scheduler(ipc, storage);

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
