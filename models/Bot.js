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
		// #TODO fazer this._messagesToBeRead.length = 0 após resposta
		this._api.postMessage('blabla');
		// this.addMessageToBeSent()
		
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