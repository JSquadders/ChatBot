// import {MessageView} from './MessageView';
// import {MessagesView} from './MessagesView';

/*export*/ class ChatView {

	constructor(id) {
		
		// Nome da conversa, do grupo ou da pessoa
		this._id = id;
		this._hasNewMessage = false;
		this._newMessages = [];
		this._messages = new MessagesView();
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

	get id() {
		return this._id;
	}

	async hasNewMessage() {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		let messages = await this.getMessages();
		let [smallerArray, largerArray] = (this._messages.length < messages.length ? [this._messages, messages] : [messages, this._messages]);

		// #TODO ainda não está considerando mensagens apagadas
		// #TODO está errado. Está apenas comparando o menor array com o maior e retornando true em caso positivo. Isso não significa que há mensagens novas
		return smallerArray.every((messageView, index) => (messageView.text == largerArray[index].text && messageView.sender == largerArray[index].sender));

		// #TODO funcionando para bolinha verde. Ainda é incerto se funciona quando é recebida uma mensagem na conversa atual
		// #TODO provavelmente não será mais utilizado
		return this._hasNewMessage = !!document.querySelector('span._19RFN[title="' + this._id + '"]')
			.parentNode.parentNode.parentNode.querySelector('span.P6z4j._1W1Se');
	}

	// #TODO checar se não dá problema conforme o scroll avança, já que as mensagens antigas são destruídas na renderização do React
	getNewMessages() {
		return new Promise(async (resolve, reject) => {
			let oldMessagesJSON = this._messages.reverse().map(messageView => JSON.stringify(messageView));
			console.log('oldMessagesJSON', oldMessagesJSON);
			let newMessages = await this.getMessages();
			newMessages = newMessages.reverse();
			newMessages = newMessages.filter(messageView => (messageView.datetime >= this._messages.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageView)))).reverse();
			console.log('filtered newMessages', newMessages);
			newMessages.forEach(newMessage => this._messages.push(newMessage));
			resolve(newMessages);
		});
	}

	async postMessage(msg) {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		let chat = await this.querySelector('._3u328');
		chat.textContent = msg;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		document.querySelector('._3M-N-').click(); // Checar se não haverá problema de sincronia
	}

	// #TODO filtrar mensagens excluídas
	async getMessages() {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		// let messageDivs = [...await this.querySelectorAll('span.selectable-text span')].reverse();
		return new MessagesView(...[...await this.querySelectorAll('.-N6Gq')].reverse().map(messageDiv => new MessageView(messageDiv)));
	}
}