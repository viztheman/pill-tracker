const scheduler = require('node-schedule');
const {DateTime} = require('luxon');

class Scheduler {
	constructor(mainWindow, storage) {
		this._mainWindow = mainWindow;
		this._storage = storage;

		this._job = scheduler.scheduleJob(
			'0 0 * * *', () => this.resetIfNeeded(true)
		);
		this.resetIfNeeded(false);
	}

	get needsReset() {
		const now = DateTime.now().startOf('day').valueOf();

		const then = DateTime
			.fromMillis(this._storage.lastUpdated)
			.startOf('day')
			.valueOf();

		return now > then;
	}

	resetIfNeeded(sendIpc) {
		if (this._needsReset)
			this._storage.reset(sendIpc);
	}
}

module.exports = Scheduler;
