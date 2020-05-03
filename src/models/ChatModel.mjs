export default class ChatModel {
	constructor(id) {
		this._id = id;
		this._messages = [], this._messagesToBeRead = [],	this._messagesToBeSent = [];
		this._bots = new Map();
	}
	
	bots() {
		return this._bots;
	}

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

	addMessageToBeRead(msg) {
		if (msg) {
			this._messagesToBeRead.push(msg);
			return this._messages.push(msg);
		}
	}

	addMessageToBeSent(msg) {
		if (msg) {
			this._messagesToBeSent.push(msg);
			return this._messages.push(msg);
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
				this._messagesToBeRead.forEach(receivedMsg => {
					if (new RegExp(`\\b${bot.name}\\b`, 'i').test(receivedMsg)) {
						// @todo Implement [bot:stop]
						if (receivedMsg.includes(`[${bot.name}:reset]`))
							return bot.clearMessagesToBeRead();
						else if (receivedMsg.includes(`[${bot.name}`))
							return;

						receivedMsg = receivedMsg.replace(new RegExp(`[^a-z|\\d|\\u00E0-\\u00FC]*\\b${bot.name}\\b`, 'i'), '').replace(/^\W+/, '');
						if (/[a-z|\d]\s*$/i.test(receivedMsg))
							receivedMsg += '.';
						bot.addMessageToBeRead(receivedMsg);
					}
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