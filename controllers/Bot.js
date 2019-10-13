export class Bot {
	constructor(name) {
		this._name = name;

		// #TODO falta atribuir view e model de alguma forma
		this._chat = chat;
		this.refreshInterval = 5000;
		this.ready = true;
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