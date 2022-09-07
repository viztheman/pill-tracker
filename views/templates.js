'use strict';

(function() {
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

	window.loadTemplates = loadTemplates;
})();
