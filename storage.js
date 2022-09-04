const STORAGE_KEY = 'storage';

const jsonStorage = require('electron-json-storage');

class Storage {
	constructor() {
		this._storage = jsonStorage.getSync(STORAGE_KEY);

		if (Object.keys(this._storage).length === 0)
			this._initialize();
	}

	get medications() {
		return this._storage.medications;
	}

	get lastUpdated() {
		return this._storage.lastUpdated;
	}

	set lastUpdated(millis) {
		this._storage.lastUpdated = millis;
	}

	_initialize() {
		this._storage = {medications: [], lastUpdated: Date.now()};
		this.save();
	}

	addOrReplace(medication) {
		const index = this._storage
			.medications.findIndex(x => x.id === medication.id);

		if (index < 0)
			this._storage.medications.push(medication);
		else
			this._storage.medications[index] = {...medication};

		return this;
	}

	remove(medication) {
		const index = this._storage
			.medications.findIndex(x => x.id === medication.id);

		if (index < 0)
			return;

		this._storage.medications.splice(index, 1);
		return this;
	}

	save() {
		jsonStorage.set(STORAGE_KEY, this._storage);
	}
}

module.exports = Storage;
