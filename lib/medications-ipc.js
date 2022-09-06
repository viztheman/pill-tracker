const {ipcMain} = require('electron')

class MedicationsIpc {
	constructor(mainWindow, storage) {
		this._mainWindow = mainWindow;
		this._storage = storage;

		ipcMain.handle('medications:get', this._get.bind(this));
		ipcMain.handle('medications:set', this._set.bind(this));
		ipcMain.handle('medications:remove', this._remove.bind(this));
	}

	_get() {
		return this._storage.medications;
	}

	_set(_event, medications) {
		this._storage.addOrReplace(medications).save();
	}

	_remove(_event, medication) {
		this._storage.remove(medication).save();
	}

	refresh(medications) {
		this._mainWindow.webContents
			.send('medications:refresh', medications);
	}
}

module.exports = MedicationsIpc;
