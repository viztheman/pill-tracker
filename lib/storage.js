const STORAGE_KEY = 'storage';

const {dialog} = require('electron');
const jsonStorage = require('electron-json-storage');
const path = require('path');

class Storage {
	constructor(dataPath) {
		jsonStorage.setDataPath(dataPath);
		this._storage = jsonStorage.getSync(STORAGE_KEY);
		this.save();
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
		if (!this._storage.medications)
			this._storage.medications = [];

		if (!this._storage.lastUpdated)
			this._storage.lastUpdated = Date.now();
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

	save(dataPath) {
		if (dataPath)
			jsonStorage.set(STORAGE_KEY, this._storage, {dataPath});
		else
			jsonStorage.set(STORAGE_KEY, this._storage);
	}

	reset() {
		delete this.dataPath;

		this._storage.medications.forEach(x => {
			x.morning = false;
			x.afternoon = false;
			x.evening = false;
		});
		this._storage.lastUpdated = Date.now();

		this.save();
	}

	_showExportDialog() {
		return dialog.showSaveDialogSync({
			title: 'Export Medications',
			buttonLabel: 'Export',
			filters: [
				{name: 'All Files', extensions: ['*']}
			],
			properties: ['showOverwriteConfirmation']
		});
	}

	_showImportDialog() {
		return dialog.showOpenDialogSync({
			title: 'Import Medications',
			buttonLabel: 'Import',
			filters: [
				{name: 'JSON Files', extensions: ['json']},
				{name: 'All Files', extensions: ['*']}
			],
			properties: ['openFile', 'dontAddToRecent']
		});
	}

	export() {
		const file = this._showExportDialog();
		if (!file) return;

		this.save(file);
	}

	import() {
		const file = this._showImportDialog();
		if (!file) return;

		const realPath = jsonStorage.getDataPath();
		try {
			jsonStorage.setDataPath(path.dirname(file[0]));
			this._storage = jsonStorage.getSync(STORAGE_KEY);
			this.reset();
		}
		finally {
			jsonStorage.setDataPath(realPath);
		}
		this.save();
	}
}

module.exports = Storage;
