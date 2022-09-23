const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('medications', {
	get: () => ipcRenderer.invoke('medications:get'),
	set: (medication) => ipcRenderer.invoke('medications:set', medication),
	remove: (medication) => ipcRenderer.send('medications:remove', medication),
	refresh: () => ipcRenderer.invoke('medications:refresh'),
	ping: () => ipcRenderer.invoke('medications:ping'),
	onReset: (callback) => ipcRenderer.on('medications:reset', callback)
});

contextBridge.exposeInMainWorld('settings', {
	getUseCloudStorage: () => ipcRenderer.invoke('settings:get:useCloudStorage'),
	setUseCloudStorage: (useCloud) => ipcRenderer.invoke('settings:set:useCloudStorage', useCloud),
	getStoragePath: () => ipcRenderer.invoke('settings:get:storagePath'),
	setStoragePath: () => ipcRenderer.invoke('settings:set:storagePath')
});
