let id;

function VersionsViewModel() {
	this.medications = ko.observableArray([]);
	this.addRemoveSwitch = ko.observable(false);
	this.name = ko.observable(null);
	this.dosage = ko.observable(null);
	this.showSettings = ko.observable(false);

	this.mainPanelClass = ko.pureComputed(() => {
		const showSettings = this.showSettings();
		return !showSettings ? 'd-flex' : 'd-none';
	});

	this.noMedicationsClass = ko.pureComputed(() => {
		const addRemoveSwitch = this.addRemoveSwitch();
		const length = this.medications().length;

		return !addRemoveSwitch && length === 0
			? 'd-flex'
			: 'd-none';
	});

	this.medicationsClass = ko.pureComputed(() => {
		const addRemoveSwitch = this.addRemoveSwitch();
		const length = this.medications().length;

		return !addRemoveSwitch && length > 0
			? 'd-flex'
			: 'd-none';
	});

	this.addRemoveClass = ko.pureComputed(() => {
		const addRemoveSwitch = this.addRemoveSwitch();
		return addRemoveSwitch ? 'd-flex' : 'd-none';
	});

	this.settingsPanelClass = ko.pureComputed(() => {
		const showSettings = this.showSettings();

		return showSettings ? 'd-flex' : 'd-none';
	});

	this.setMedication = (medication) => {
		window.medications.set(medication)
	};

	this.addMedication = () => {
		if (!this.name() || !this.dosage())
			return;

		const medication = {
			id: id++,
			name: this.name(),
			dosage: this.dosage(),
			morning: false,
			afternoon: false,
			evening: false
		};
		window.medications.set(medication);

		this.medications.push(medication);
		this.name(null);
		this.dosage(null);
		document.getElementById('name').focus();
	};
	
	this.removeMedication = (medication) => {
		const index = this.medications.indexOf(medication);
		if (index < 0) return;

		window.medications.remove(medication);
		this.medications.splice(index, 1);
	};

	this.addRemoveClick = () => {
		this.addRemoveSwitch(true);
	};

	this.gearClick = () => {
		this.showSettings(true);
	};

	this.backButtonClick = () => {
		this.showSettings(false);
	};
}

async function loadTemplate(script) {
	if (!script.src)
		return;

	const response = await fetch(script.src);
	const text = await response.text();

	const newScript = document.createElement('script');
	newScript.type = 'text/html';
	newScript.id = script.id;
	newScript.innerText = text;

	script.remove();
	document.querySelector('body').appendChild(newScript);
}

async function loadTemplates() {
	const scripts = document.querySelectorAll('script[type="text/html"]');

	for (const script of scripts)
		await loadTemplate(script);
}

function getMaxId(medications) {
	const maxInUse = medications.reduce(
		(max, medication) => Math.max(medication.id, max),
		0
	);
	return maxInUse + 1;
}

document.addEventListener('DOMContentLoaded', async () => {
	const medications = await window.medications.get();
	id = getMaxId(medications);

	await loadTemplates();

	const viewModel = new VersionsViewModel(medications);
	ko.applyBindings(viewModel);
	viewModel.medications(medications);

	window.medications.onRefresh((_event, medications) => {
		viewModel.medications(medications);
	});
});
