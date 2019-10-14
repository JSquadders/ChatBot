import {BotAPI} from '../services/BotAPI';

export class Bot {
	constructor(name) {
		this._name = name;
		this._messagesToBeRead = [];
		this._messagesToBeSent = [];
		this._read = true;
		this._replied = true;
		this._api = new BotAPI();
	}

	get name() {
		return this._name;
	}

	set name(value) {
		return this._name = value;
	}

	addMessageToBeRead(msg) {
		this._read = false;
		return this._messagesToBeRead.unshift(msg);
	}
	
	addMessageToBeSent(msg) {
		this._sent = false;
		return this._messagesToBeSent.unshift(msg);
	}

	reply() {
		// #TODO retorna Promise fetch()
		// #TODO fazer this._newMessages.length = 0 após resposta
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
			this._api.postMessage('blabla');
			// this.addMessageToBeSent()
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