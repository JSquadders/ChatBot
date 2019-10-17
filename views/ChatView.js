/*export*/ class ChatView {

	constructor(title) {
		
		// Nome da conversa, do grupo ou da pessoa
		this._title = title;
		this._hasNewMessage = false;
		this._checked = false;
		this._newMessages = [];
	}

	querySelector(selector, fulfillmentCallback = (element, timeElapsed) => (element || timeElapsed > 3000), rootElement = document) {
		return new Promise((resolve, reject) => {
			let timeElapsed = 0;
			const intervalID = setInterval(() => {
				const element = rootElement.querySelector(selector);
				if (fulfillmentCallback(element, timeElapsed += 100)) {
					clearInterval(intervalID);
					resolve(element);
				}
			},
			100);
		});
	}

	querySelectorAll(selector, fulfillmentCallback = (elements, timeElapsed) => (elements.length || timeElapsed > 3000), rootElement = document) {
		return new Promise((resolve, reject) => {
			let timeElapsed = 0;
			const intervalID = setInterval(() => {
				const elements = rootElement.querySelectorAll(selector);
				if (fulfillmentCallback(elements, timeElapsed += 100)) {
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

	checked() {
		this._checked = true;
		this._newMessages.length = 0;
	}

	hasNewMessage() {
		// #TODO funcionando para bolinha verde. Ainda é incerto se funciona quando é recebida uma mensagem na conversa atual
		return this._hasNewMessage = !!document.querySelector('span._19RFN[title="+55 11 99814-9449"]')
			.parentNode.parentNode.parentNode.querySelector('span.P6z4j._1W1Se');
	}

	getNewMessages() {
		return new Promise((resolve, reject) => {
			document.querySelector('span._19RFN[title="' + this._title + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
			
			// #TODO retorna todas as mensagens abaixo do "Unread Messages"
			this._newMessages = this.querySelectorAll('._3Xx0y ~ div.message-in span.selectable-text span').then(elements => resolve([...elements].reverse()));
		});
	}

	async postMessage(msg) {
		document.querySelector('span._19RFN[title="' + this._title + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		let chat = await this.querySelector('._3u328');
		chat.textContent = msg;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		document.querySelector('._3M-N-').click(); // Checar se não haverá problema de sincronia
	}

	async getMessages() {
		document.querySelector('span._19RFN[title="' + this._title + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		return [...await this.querySelectorAll('div.message-in span.selectable-text span')].reverse();
	}
}