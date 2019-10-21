// import {MessageViewmodel} from './viewmodels/MessageViewmodel';
// import {MessagesViewmodel} from './viewmodels/MessagesViewmodel';

/*export*/ class ChatView {

	constructor(id) {
		
		// Pode ser o nome da conversa, do grupo ou da pessoa
		this._id = id;
		this._messagesViewmodel = new MessagesViewmodel();
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

	hasNewMessage() {
		return new Promise(async (resolve, reject) => {
			let oldMessagesJSON = this._messagesViewmodel.map(messageViewmodel => JSON.stringify(messageViewmodel));
			resolve(!!(await this.getMessages()).filter(messageViewmodel => (messageViewmodel.datetime >= this._messagesViewmodel.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageViewmodel)))).length);
		});
	}

	// #TODO checar se não dá problema conforme o scroll avança, já que as mensagens antigas são destruídas na renderização do React
	popNewMessages() {
		return new Promise(async (resolve, reject) => {
			let oldMessagesJSON = this._messagesViewmodel.map(messageViewmodel => JSON.stringify(messageViewmodel));
			let newMessages = (await this.getMessages()).filter(messageViewmodel => (messageViewmodel.datetime >= this._messagesViewmodel.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageViewmodel))));
			newMessages.forEach(newMessage => this._messagesViewmodel.push(newMessage));
			resolve(newMessages);
		});
	}

	async postMessage(msg) {
		console.log('postMessage', msg);
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		let chat = await this.querySelector('._3u328');
		chat.textContent = msg;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		document.querySelector('._3M-N-').click(); // Checar se não haverá problema de sincronia
		let myMessages = await this.querySelectorAll('div.message-out div.-N6Gq');
		let messageViewmodel = new MessageViewmodel(myMessages[myMessages.length - 1]);
		this._messagesViewmodel.push(messageViewmodel);
	}

	async getMessages() {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));

		// #TODO dar um tempo mínimo de espera neste querySelector pois demora um pouco até carregar TODAS as mensagens
		return new MessagesViewmodel(...[...await this.querySelectorAll('div[data-pre-plain-text]')].map(messageDiv => new MessageViewmodel(messageDiv.parentNode)));
	}
}