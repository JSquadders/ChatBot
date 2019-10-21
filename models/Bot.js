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
		return this._messagesToBeRead.push(msg);
	}
	
	addMessageToBeSent(msg) {
		this._sent = false;
		return this._messagesToBeSent.push('```[' + this.name + ']``` ' + msg);
	}

	reply() {
		// #TODO fazer this._messagesToBeRead.length = 0 após resposta
		return new Promise((resolve, reject) => {

			if (!this._messagesToBeRead.length)
				resolve('');

			// atualmente está sempre pegando só a última mensagem
			this._api.postMessage(this._messagesToBeRead[this._messagesToBeRead.length - 1])
				.then(answer => {
					this.addMessageToBeSent(answer);
					// this._messagesToBeRead.pop();
					this._messagesToBeRead[this._messagesToBeRead.length - 1];
					// resolve(this._messagesToBeSent.pop());
					resolve(this._messagesToBeSent[this._messagesToBeSent.length - 1]);
				});
		})
	}

	// Promise
	postMessage(msg) {

		// #TODO não existe this._chatView
		this._chatView.postMessage('```[' + this._name + ']``` ' + msg);
	}

	// #TODO implementar mais tarde
	// Promise
	postMessageToBot(bot, msg) {
		this.postMessage('```[to:' + bot.name + ']```' + msg)
	}
}