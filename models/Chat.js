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

	get messages() {
		return [...this._messages];
	}

	addMessage(message) {
		return this._messages.unshift(message);
	}

	setMessages(messages) {
		this._messages = messages;
	}
}