const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('medications', {
	get: () => ipcRenderer.invoke('medications:get'),
	set: (medication) => ipcRenderer.send('medications:set', medication),
	remove: (medication) => ipcRenderer.send('medications:remove', medication),
	onReset: (callback) => ipcRenderer.on('medications:reset', callback)
});

contextBridge.exposeInMainWorld('settings', {
	getStoragePath: () => ipcRenderer.invoke('settings:get:storagePath'),
	setStoragePath: () => ipcRenderer.invoke('settings:set:storagePath')
});
