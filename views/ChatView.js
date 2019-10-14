export class ChatView {
	constructor(title) {
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;
		this._hasNewMessage = false;
		this._checked = false;
		this._newMessages = [];
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	checked() {
		this._checked = true;
		this._newMessages.length = 0;
	}

	hasNewMessage() {
		document.querySelectorAll('.P6z4j._1W1Se'); // #TODO retorna os que têm bolinha verde de alerta
		this._hasNewMessage = true;
		return true;
	}

	getNewMessages() {
		// #TODO mensagem mais recente na posição 0
	}

	postMessage(msg) {
		document.querySelector('._3u328').textContent = msg;
		document.querySelector('._3u328').dispatchEvent(new Event('input', {bubbles: true}));
		document.querySelector('._3M-N-').click();
	}

	getMessages() {
		// #TODO mensagem mais recente na posição 0
		this._hasNewMessage = false;
		return [...document.querySelectorAll('span.selectable-text span')];
	}
}