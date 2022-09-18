const jsonStorage = require('electron-json-storage');
const path = require('path');

const STORAGE_KEY = 'storage';

class Storage {
	constructor(settings) {
		this._settings = settings;
		this._storage = this._load();
		this._initialize();
		this.save();

		this._nextId = this._storage.medications.length === 0
			? 1
			: Math.max(...this._storage.medications.map(x => x.id + 1))
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

		if (index < 0) {
			medication.id = this._nextId++;
			this._storage.medications.push(medication);
		}
		else
			this._storage.medications[index] = medication;

		this.save();
		return medication;
	}

	remove(medication) {
		const index = this._storage
			.medications.findIndex(x => x.id === medication.id);

		if (index < 0)
			return;

		this._storage.medications.splice(index, 1);
		this.save();
	}

	save() {
		jsonStorage.set(
			STORAGE_KEY,
			this._storage,
			{dataPath: this._settings.storagePath}
		);
	}
	
	_load() {
		return jsonStorage.getSync(STORAGE_KEY, {dataPath: this._settings.storagePath});
	}

	reset(sendIpc) {
		this._storage.medications.forEach(x => {
			x.morning = false;
			x.afternoon = false;
			x.evening = false;
		});
		this._storage.lastUpdated = Date.now();
		this.save();

		if (sendIpc)
			this._mainWindow.webContents.send('medications:reset');
	}
}

module.exports = Storage;
