const {app, dialog} = require('electron');
const jsonStorage = require('electron-json-storage');
const path = require('path');

const SETTINGS_KEY = 'settings';

class Settings {
	constructor() {
		this._dataPath = app.getPath('userData');
		this._settings = this._load();
		this._initialize();
		console.dir(this._settings);
		this._save();
	}

	get useCloudStorage() {
		return this._settings.useCloudStorage;
	}

	set useCloudStorage(value) {
		this._settings.useCloudStorage = !!value;

		if (!value)
			this._settings.storagePath = this._dataPath;

		this._save();
	}

	get storagePath() {
		return this._settings.storagePath;
	}

	setStoragePath() {
		const files = dialog.showOpenDialogSync({
			title: 'Select Storage Path',
			filters: [{name: 'All Files', extensions: ['*']}],
			properties: ['openDirectory', 'createDirectory', 'dontAddToRecent']
		});
		if (!files) return;

		this._settings.storagePath = files[0];
		this._save();
		return files[0];
	}

	_load() {
		return jsonStorage.getSync(SETTINGS_KEY, {dataPath: this._dataPath});
	}

	_initialize() {
		if (!this._settings.useCloudStorage)
			this._settings.useCloudStorage = false;
		if (!this._settings.storagePath)
			this._settings.storagePath = app.getPath('userData');
	}

	_save() {
		jsonStorage.set(
			SETTINGS_KEY,
			this._settings,
			{dataPath: this._dataPath}
		);
	}
}

module.exports = Settings;
