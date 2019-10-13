// #TODO considerar que uma mensagem pode ser apagada ou editada
export class ChatView {
	constructor(title) {
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;

		// array com todas as mensagens da conversa
		// Atenção com ordem das mensagens: a mais recente sempre está na posição 0
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	// #TODO talvez Promise
	postMessage(msg) {
	}

	// #TODO talvez Promise
	getMessages() {
	}
}