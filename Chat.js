export class Chat {
	constructor(title) {
		this._title = title;
		this._messages = []; // mensagens da mais recente para a mais antiga
	}
	
	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	getMessages() {
		return [...this._messages];
	}

	addMessage(msg) {
		return this._messages.unshift(msg);
	}

	setMessages(msgs) {
		this._messages = msgs;
	}
}