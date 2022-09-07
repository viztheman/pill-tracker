const {app} = require('electron');
const jsonStorage = require('electron-json-storage');
const path = require('path');

const SETTINGS_KEY = 'settings';

class Settings {
	constructor() {
		this._dataPath = app.getPath('userData');
		this._settings = this._load();
		this._initialize();
		this._save();
	}

	get storagePath() {
		return this._settings.storagePath;
	}

	set storagePath(newPath) {
		this._settings.storagePath = path.dirname(newPath);
		this._save();
	}

	_load() {
		return jsonStorage.getSync(SETTINGS_KEY, {dataPath: this._dataPath});
	}

	_initialize() {
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
