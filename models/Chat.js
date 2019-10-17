/*export*/ class Chat {
	
	constructor(title) {
		this._title = title;
		this._messages = []; // mensagens da mais recente para a mais antiga
		this._messagesToBeRead = []; // mensagens da mais recente para a mais antiga
		this._messagesToBeSent = [];
		this._bots = new Map();
		this._checked = false;
	}
	
	addBot(bot) {
		this._bots.set(bot.name, bot);
	}

	nBots() {
		return this._bots.size;
	}

	get checked() {
		return this._checked;
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	get messages() {
		return [...this._messages];
	}

	addMessageToBeRead(message) {
		this._messagesToBeRead.unshift(message);
		return this._messages.unshift(message);
	}

	addMessageToBeSent(message) {
		this._messagesToBeSent.unshift(message);
		return this._messages.unshift(message);
	}

	reply() {
		return new Promise((resolve, reject) => {
			// if (/\[bot:reset\]/.test(message)) {
			// 	msgBuffer = [];
			// } else
			
			for (let bot of this._bots.values()) {
				this._messagesToBeRead.forEach(receivedMessage => {
					let receivedMessageTreated = '';
					if (new RegExp(`\\b${bot.name}\\b`, 'i').test(receivedMessage)) {
						receivedMessageTreated += receivedMessage.replace(new RegExp(`[^a-z|\d|\u00E0-\u00FC]*\b${bot.name}\b[^a-z|\d|\u00E0-\u00FC]*`, 'i'));
						if (/[a-z|\d]\s*$/i.test(receivedMessageTreated))
							receivedMessageTreated += '.';
					}

					if (receivedMessageTreated.length > 0) {
						bot.addMessageToBeRead(receivedMessageTreated);
					}
				})
				bot.reply()
					.then(answer => {
						this.addMessageToBeSent(answer);
						resolve(answer);
					});
			}

			// if (/\bBOT\b/i.test(message) && !/\[bot:listening\]|\[bot:stop\]/.test(message)) {
			// 	 let msg = message.replace(/[^a-z|\d|\u00E0-\u00FC]*\bBOT\b[^a-z|\d|\u00E0-\u00FC]*/i, '');
			// 	 if (msg.length) {
			// 	 	if (/[a-z|\d]\s*$/i.test(msg))
			// 	 		msg += '.';
			// 	 	bot.addMessage(msg);
			// 	 	bot.reply();
			//	 }
			// }
		})
	}
}