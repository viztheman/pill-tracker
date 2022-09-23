const {ipcMain: ipc} = require('electron');

const settings = require('../settings');
const storage = require('../storage');

ipc.handle('settings:get:useCloudStorage', () => {
	return settings.useCloudStorage;
});

ipc.handle('settings:set:useCloudStorage', (_e, useCloud) => {
	settings.useCloudStorage = useCloud;
});

ipc.handle('settings:get:storagePath', () => {
	return settings.storagePath;
});

ipc.handle('settings:set:storagePath', () => {
	const path = settings.setStoragePath();
	if (!path) return;

	storage.load(path);
	return path;
});
