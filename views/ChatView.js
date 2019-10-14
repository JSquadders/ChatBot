// #TODO considerar que uma mensagem pode ser apagada ou editada
export class ChatView {
	constructor(title) {
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;
		this._hasNewMessage = false;
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	hasNewMessage() {
		// #TODO implementar verificação
		this._hasNewMessage = true;
		return true;
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