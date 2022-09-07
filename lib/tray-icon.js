const {Tray, Menu, nativeImage} = require('electron');
const path = require('path');

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
module.exports = trayIcon;
