const {app, dialog} = require('electron');
const jsonStorage = require('electron-json-storage');

const SETTINGS_KEY = 'settings';

class Settings {
	get useCloudStorage() {
		return this._settings.useCloudStorage;
	}

	set useCloudStorage(value) {
		this._settings.useCloudStorage = !!value;

		if (!value)
			this._settings.storagePath = this._settingsPath;

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

	load(path) {
		this._settingsPath = path;
		this._settings = jsonStorage.getSync(SETTINGS_KEY, {dataPath: path});

		if (Object.keys(this._settings).length === 0) {
			this._initialize();
			this._save();
		}
	}

	_initialize() {
		this._settings = {
			useCloudStorage: false,
			storagePath: this._settingsPath
		};
	}

	_save() {
		jsonStorage.set(SETTINGS_KEY, this._settings, {dataPath: this._settingsPath});
	}
}

module.exports = new Settings();
