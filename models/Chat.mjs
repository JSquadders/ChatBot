export class Chat {
	constructor(id) {
		this._id = id;
		this._messages = [];
		this._messagesToBeRead = [];
		this._messagesToBeSent = [];
		this._bots = new Map();
	}
	
	bots() {
		return this._bots;
	}

	// #TODO talvez não precise mais, agora que os bots estão expostos
	addBot(bot) {
		this._bots.set(bot.name, bot);
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get messages() {
		return [...this._messages];
	}

	addMessageToBeRead(message) {
		if (message) {
			this._messagesToBeRead.push(message);
			return this._messages.push(message);
		}
	}

	addMessageToBeSent(message) {
		if (message) {
			this._messagesToBeSent.push(message);
			return this._messages.push(message);
		}
	}

	clearMessagesToBeRead() {
		this._messagesToBeRead.length = 0;
	}

	popMessagesToBeSent() {
		const messagesToBeSent = [...this._messagesToBeSent];
		this._messagesToBeSent.length = 0;
		return messagesToBeSent;
	}

	reply() {
		return new Promise(async (resolve) => {
			for (let bot of this._bots.values()) {
				this._messagesToBeRead.forEach(receivedMessage => {
					let receivedMessageTreated = '';
					if (new RegExp(`\\b${bot.name}\\b`, 'i').test(receivedMessage)) {
						// #TODO implementar [bot:stop]
						if (receivedMessage.includes('[```' + bot.name + '```:reset]'))
							return bot.clearMessagesToBeRead();
						else if (receivedMessage.includes('[```' + bot.name + '```:listening]'))
							return;
						receivedMessageTreated = receivedMessage.replace(new RegExp(`[^a-z|\\d|\\u00E0-\\u00FC]*\\b${bot.name}\\b[^a-z|\\d|\\u00E0-\\u00FC]*`, 'i'), '');
						if (/[a-z|\d]\s*$/i.test(receivedMessageTreated))
							receivedMessageTreated += '.';
					}

					if (receivedMessageTreated.length > 1)
						bot.addMessageToBeRead(receivedMessageTreated);
				});
			}

			this.clearMessagesToBeRead();			

			await Promise.all([...this._bots.values()].map(bot => bot.reply()));

			this._bots.forEach(bot => {
				bot.clearMessagesToBeRead();
				this.addMessageToBeSent(bot.getAnswer());
			});

			resolve();
		});
	}
}