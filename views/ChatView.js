// #TODO considerar que uma mensagem pode ser apagada ou editada
export class ChatView {
	constructor(title) {
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;

		// array com todas as mensagens da conversa
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	hasNewMessage() {
		// #TODO qualquer mensagem nova que ainda não tenha sido consultada
	}

	postMessage(msg) {
		// #TODO talvez Promise
	}

	getMessages() {
		// #TODO talvez Promise
		// #TODO Atenção com ordem das mensagens: a mais recente sempre está na posição 0
	}
}