const {app, ipcMain: ipc} = require('electron');
if (require('electron-squirrel-startup')) return app.quit();

const path = require('path');
const MainWindow = require('./lib/mainwindow');
const settings = require('./lib/settings');
const storage = require('./lib/storage');

app.whenReady().then(() => {
	let mainWindow = new MainWindow();

	const trayIcon = require('./lib/trayicon');
	trayIcon.mainWindow = mainWindow;

	settings.load(app.getPath('userData'));
	storage.load(settings.storagePath);

	require('./lib/ipc/settings');
	require('./lib/ipc/medications');

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			mainWindow = new MainWindow();
			trayIcon.mainWindow = mainWindow;
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});
