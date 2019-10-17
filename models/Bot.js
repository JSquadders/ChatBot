// import {BotAPI} from '../services/BotAPI';

/*export*/ class Bot {
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
		return this._messagesToBeSent.unshift('```[' + this.name + ']``` ' + msg);
	}

	reply() {
		// #TODO retorna Promise fetch()
		// #TODO fazer this._messagesToBeRead.length = 0 após resposta
		// #TODO confirmar se é this._messagesToBeRead[0] mesmo, e se sempre será só 1 mensagem
		return new Promise((resolve, reject) => {
			this._api.postMessage(this._messagesToBeRead[0])
				.then(answer => {
					this.addMessageToBeSent(answer);
					resolve(answer);
				});
		})
	}

	// boolean ou Promise
	postMessage(msg) {
		// #TODO não existe this._chatView
		this._chatView.postMessage('```[' + this._name + ']``` ' + msg);
	}

	// #TODO implementar mais tarde
	// boolean ou Promise
	postMessageToBot(bot, msg) {
		this.postMessage('```[to:' + bot.name + ']```' + msg)
	}
}