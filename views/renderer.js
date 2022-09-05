let id;

function VersionsViewModel(medications) {
	this.addRemoveSwitch = ko.observable();
	this.medications = ko.observableArray(medications);
	this.name = ko.observable();
	this.dosage = ko.observable();

	this.showNoMedication = ko.pureComputed(() => {
		return !this.addRemoveSwitch() && this.medications().length === 0
			? 'd-flex'
			: 'd-none';
	});

	this.showMedication = ko.pureComputed(() => {
		return !this.addRemoveSwitch() && this.medications().length > 0
			? 'd-flex'
			: 'd-none'
	});

	this.showAddRemove = ko.pureComputed(() => {
		return this.addRemoveSwitch() ? 'd-flex' : 'd-none'
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

	this.enableAddRemove = () => {
		this.addRemoveSwitch(true);
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

	if (medications.length === 0) {
		document.getElementById('no-medications').classList.remove('d-none');
		document.getElementById('medications').classList.add('d-none');
	}
	else {
		document.getElementById('no-medications').classList.add('d-none');
		document.getElementById('medications').classList.remove('d-none');
	}

	const viewModel = new VersionsViewModel(medications);
	ko.applyBindings(viewModel);

	window.medications.onRefresh((_event, medications) => {
		viewModel.medications(medications);
	});
});
