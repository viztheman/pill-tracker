'use strict';

(function() {
	function VersionsViewModel() {
		this.medications = ko.observableArray([]);
		this.addRemoveSwitch = ko.observable(false);
		this.name = ko.observable(null);
		this.dosage = ko.observable(null);
		this.showSettings = ko.observable(false);
		this.storagePath = ko.observable(null);

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

		this.gearClick = () => this.showSettings(true);
		this.addRemoveClick = () => this.addRemoveSwitch(true);
		this.setMedication = (medication) => window.medications.set(medication);
		this.backButtonClick = () => this.showSettings(false);

		this.addMedication = () => {
			if (!this.name() || !this.dosage())
				return;

			const medication = {
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

		this.storagePathClick = async () => {
			const newStoragePath = await window.settings.setStoragePath();
			if (newStoragePath)
				this.storagePath(newStoragePath);
		};
	}

	document.addEventListener('DOMContentLoaded', async () => {
		await window.loadTemplates();

		const storagePath = await window.settings.getStoragePath();
		const medications = await window.medications.get();

		const viewModel = new VersionsViewModel(medications);
		ko.applyBindings(viewModel);
		viewModel.medications(medications);
		viewModel.storagePath(storagePath);

		window.medications.onReset((_event, medications) => {
			viewModel.medications(medications);
		});
	});
})();
