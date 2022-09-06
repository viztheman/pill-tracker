const scheduler = require('node-schedule');
const {DateTime} = require('luxon');

class Scheduler {
	constructor(ipc, storage) {
		this._ipc = ipc;
		this._storage = storage;
		this._job = scheduler.scheduleJob(
			'0 0 * * *', this.resetIfNeeded.bind(this, true)
		);

		this.resetIfNeeded(false);
	}

	get _needsReset() {
		if (!this._storage.lastUpdated)
			return true;

		const now = DateTime.now().startOf('day').valueOf();

		const then = DateTime
			.fromMillis(this._storage.lastUpdated)
			.startOf('day');

		return now > then;
	}

	_reset() {
		for (const medication of this._storage.medications) {
			medication.morning = false;
			medication.afternoon = false;
			medication.evening = false;
		}

		this._storage.lastUpdated = Date.now();
		this._storage.save();
	}

	resetIfNeeded(sendRefresh) {
		if (!this._needsReset)
			return;

		this._reset();

		if (sendRefresh)
			this._ipc.refresh(storage.medications);
	}
}

module.exports = Scheduler;
