const jsonStorage = require('electron-json-storage');
const path = require('path');

const STORAGE_KEY = 'storage';

class Storage {
	constructor(settings) {
		this._storagePath = settings.storagePath;
		this._storage = this._load();
		this._initialize();
		this._save();
	}

	get medications() {
		return this._storage.medications;
	}

	_initialize() {
		if (!this._storage.medications)
			this._storage.medications = [];

		if (!this._storage.lastUpdated)
			this._storage.lastUpdated = Date.now();
	}

	set(medication) {
		const index = this._storage
			.medications.findIndex(x => x.id === medication.id);

		if (index < 0)
			this._storage.medications.push(medication);
		else
			this._storage.medications[index] = {...medication};

		this._save();
	}

	remove(medication) {
		const index = this._storage
			.medications.findIndex(x => x.id === medication.id);

		if (index < 0)
			return;

		this._storage.medications.splice(index, 1);
		this._save();
	}

	_save() {
		jsonStorage.set(
			STORAGE_KEY,
			this._storage,
			{dataPath: this._dataPath}
		);
	}
	
	_load() {
		return jsonStorage.getSync(STORAGE_KEY, {dataPath: this._dataPath});
	}

	reset(sendIpc) {
		this._storage.medications.forEach(x => {
			x.morning = false;
			x.afternoon = false;
			x.evening = false;
		});
		this._storage.lastUpdated = Date.now();
		this._save();

		if (sendIpc)
			this._mainWindow.webContents.send('medications:reset');
	}
}

module.exports = Storage;
