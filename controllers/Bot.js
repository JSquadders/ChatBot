export class Bot {
	constructor(name) {
		this._name = name;
		this._chatController;
		this.refreshInterval = 5000;
		this.ready = false;
	}

	set chatController(value) {
		this._chatController = value;
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}
	
	answer() {
		// #TODO separa mensagens que lhe interessam
		// #TODO retorna Promise fetch()

		// #TODO muito confuso modo de acessar mensagens, que estão replicadas em vários lugares
		this._chatController.chat.messages.forEach(msg => {
			if (/\[bot:reset\]/.test(msgSpan.textContent)) {
				msgBuffer = [];
			} else if (/\bBOT\b/i.test(msgSpan.textContent) && !/\[bot:listening\]|\[bot:stop\]/.test(msgSpan.textContent)) {
				let msg = msgSpan.textContent.replace(/[^a-z|\d|\u00E0-\u00FC]*\bBOT\b[^a-z|\d|\u00E0-\u00FC]*/i, '');
				if (!msg.length)
					msg = arr[index - 1].textContent.replace(/[^a-z|\d|\u00E0-\u00FC]*\bBOT\b[^a-z|\d|\u00E0-\u00FC]*/i, '');
				if (msg.length) {
					if (/[a-z|\d]\s*$/i.test(msg))
						msg += '.';
					msgBuffer.unshift(msg);
				}
			}
		})
	}

	// boolean ou Promise
	postMessage(msg) {
		this._chatView.postMessage('```[' + this._name + ']``` ' + msg);
	}

	// #TODO implementar mais tarde
	// boolean ou Promise
	postMessageToBot(bot, msg) {
		this.postMessage('```[to:' + bot.name + ']```' + msg)
	}
}