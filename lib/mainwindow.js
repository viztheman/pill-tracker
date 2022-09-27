const {BrowserWindow} = require('electron');
const path = require('path');

module.exports = function MainWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, '../preload.js')
		}
	});

	mainWindow.loadFile(path.join(__dirname, '../views/index.html'));
	mainWindow.setMenu(null);
	mainWindow.on('minimize', () => mainWindow.hide());
	return mainWindow;
};
