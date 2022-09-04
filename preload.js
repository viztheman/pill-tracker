const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('medications', {
	get: () => ipcRenderer.invoke('medications:get'),
	set: (medication) => ipcRenderer.invoke('medications:set', medication),
	remove: (medication) => ipcRenderer.invoke('medications:remove', medication),

	onRefresh: (callback) => ipcRenderer.on('medications:refresh', callback)
});
