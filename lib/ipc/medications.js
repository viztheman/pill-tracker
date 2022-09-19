const {ipcMain: ipc} = require('electron');

const settings = require('../settings');
const storage = require('../storage');

ipc.handle('medications:get', () => storage.medications);
ipc.handle('medications:set', (_e, med) => storage.set(med));
ipc.on('medications:remove', (_e, med) => storage.remove(med));

ipc.handle('medications:refresh', () => {
	storage.load(settings.storagePath);
	return storage.medications;
});

return ipc;
