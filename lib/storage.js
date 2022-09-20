const jsonStorage = require('electron-json-storage');
const {DateTime} = require('luxon');

const STORAGE_KEY = 'storage';

class Storage {
	getNextId() {
		if (this._nextId)
			return this._nextId++;

		this._nextId = this._storage.medications.length === 0
			? 1
			: Math.max(...this._storage.medications.map(x => x.id + 1))

		return this._nextId; 
	}

	get medications() {
		return this._storage.medications;
	}

	get needsReset() {
		const today = DateTime.now().startOf('day');
		const then = DateTime.fromMillis(this._storage.lastUpdated).startOf('day');

		return today > then;
	}

	_initialize() {
		this._storage = {
			medications: [],
			lastUpdated: Date.now()
		};
	}

	set(medication) {
		const index = this._storage.medications
			.findIndex(x => x.id === medication.id);

		if (index < 0) {
			medication.id = this.getNextId();
			this._storage.medications.push(medication);
		}
		else
			this._storage.medications[index] = medication;

		this._save();
		return medication;
	}

	remove(medication) {
		const index = this._storage.medications
			.findIndex(x => x.id === medication.id);

		if (index < 0)
			return;

		this._storage.medications.splice(index, 1);
		this._save();
	}

	_save() {
		jsonStorage.set(STORAGE_KEY, this._storage, {dataPath: this._storagePath});
	}
	
	load(path) {
		this._storagePath = path;
		this._storage = jsonStorage.getSync(STORAGE_KEY, {dataPath: path});

		if (Object.keys(this._storage).length === 0) {
			this._initialize();
			this._save();
		}

		if (this.needsReset)
			this.reset();
	}

	reset() {
		this._storage.medications.forEach(x => {
			x.morning = false;
			x.afternoon = false;
			x.evening = false;
		});
		this._storage.lastUpdated = Date.now();
		this._save();
	}
}

module.exports = new Storage();
