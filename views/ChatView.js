/*export*/ class ChatView {

	constructor(title) {
		
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;
		this._hasNewMessage = false;
		this._checked = false;
		this._newMessages = [];
	}

	querySelector(selector, rootElement = document) {
		return new Promise((resolve, reject) => {
			let intervalID = setInterval(() => {
				let element = rootElement.querySelector(selector);
				if (element) {
					clearInterval(intervalID);
					resolve(element);
				}
			},
			100);
		});
	}

	querySelectorAll(selector, rootElement = document) {
		return new Promise((resolve, reject) => {
			let intervalID = setInterval(() => {
				let elements = rootElement.querySelectorAll(selector);
				if (elements.length > 1) {
					clearInterval(intervalID);
					resolve(elements);
				}
			},
			100);
		});
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
 		// #TODO true somente se a conversa tiver bolinha verde
		return !!document.querySelector('.P6z4j._1W1Se[title="' + this._title + '"]');

		document.querySelector('._2UaNq._2ko65').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window})); // #TODO retorna as conversas (para clicar em cima) que tiverem bolinha verde de alerta
		document.querySelectorAll('.P6z4j._1W1Se'); // #TODO retorna as conversas que tiverem bolinha verde de alerta
		this._hasNewMessage = true;
		
		// #TODO arrumar
		return true;
	}

	getNewMessages() {
		return new Promise((resolve, reject) => {
			document.querySelector('span._19RFN[title="' + this._title + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
			
			// #TODO retorna todas abaixo do Unread Messages
			this._newMessages = this.querySelectorAll(/*'._3Xx0y ~*/ 'div.message-in span.selectable-text span').then(elements => resolve([...elements].reverse()));
		});
	}

	postMessage(msg) {
		// #TODO mover para a conversa certa e depois rodar o código abaixo
		document.querySelector('._3u328').textContent = msg;
		document.querySelector('._3u328').dispatchEvent(new Event('input', {bubbles: true}));
		document.querySelector('._3M-N-').click();
	}

	getMessages() {
		// #TODO mensagem mais recente na posição 0
		this._hasNewMessage = false;
		return [...document.querySelectorAll('div.message-in span.selectable-text span')].reverse();
	}
}