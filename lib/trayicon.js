const {nativeImage, Tray, Menu} = require('electron');
const path = require('path');

let mainWindow, trayIcon;

class TrayIcon {
	constructor() {
		this._initialize();
	}

	set mainWindow(value) {
		this._mainWindow = value;
	}

	_initialize() {
		const icon = nativeImage.createFromPath(path.join(__dirname, '../resources/icon.png'));

		const trayIcon = new Tray(icon);
		trayIcon.setToolTip('Pill Tracker');
		trayIcon.setTitle('Pill Tracker');

		const contextMenu = Menu.buildFromTemplate([
			 {label: 'Pill Tracker', enabled: false},
			 {type: 'separator'},
			 {label: 'Show App', click: () => this._mainWindow.show()},
			 {type: 'separator'},
			 {role: 'quit'}
		]);
		trayIcon.setContextMenu(contextMenu);

		this._trayIcon = trayIcon;
	}
}

module.exports = new TrayIcon();
