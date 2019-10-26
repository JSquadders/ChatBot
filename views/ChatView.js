// import {MessageViewmodel} from './viewmodels/MessageViewmodel';
// import {MessagesViewmodel} from './viewmodels/MessagesViewmodel';

/*export*/ class ChatView {

	constructor(id) {
		
		// Pode ser o nome da conversa, do grupo ou da pessoa
		this._id = id;
		this._messagesViewmodel = new MessagesViewmodel();
	}

	querySelector(selector, fulfillmentCallback = (element, timeElapsed) => (element || timeElapsed >= 5000), rootElement = document) {
		return new Promise((resolve, reject) => {
			let timeElapsed = 0;
			const intervalID = setInterval(() => {
				const element = rootElement.querySelector(selector);
				if (fulfillmentCallback(element, timeElapsed += 1000)) {
					clearInterval(intervalID);
					resolve(element);
				}
			},
			1000);
		});
	}

	// #TODO estudar maneira de, através do callback, não só determinar quando terminou a busca, mas também alterar o retorno
	querySelectorAll(selector, fulfillmentCallback = (elements, timeElapsed) => (elements.length || timeElapsed >= 5000), rootElement = document) {
		return new Promise((resolve, reject) => {
			let timeElapsed = 0;
			const intervalID = setInterval(() => {
				let elements = rootElement.querySelectorAll(selector);
				if (fulfillmentCallback(elements, timeElapsed += 1000)) {
					clearInterval(intervalID);
					resolve(elements);
				}
			},
			1000);
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
		let chat = await this.querySelector('._3u328', (input, timeElapsed) => (input.textContent === '' || timeElapsed >= 5000));
		chat.textContent = msg;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		document.querySelector('._3M-N-').click(); // Checar se não haverá problema de sincronia
		
		let myMessage;
		await this.querySelectorAll('div.message-out div.-N6Gq', (msgDivs, timeElapsed) => {
			if (timeElapsed >= 5000)
				return true;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				let messageViewmodel = new MessageViewmodel(msgDivs[i]);
				if (msg === messageViewmodel.text) {
					myMessage = messageViewmodel;
					return true;
				}
			}
		});
		
		if (!!myMessage)
			this._messagesViewmodel.push(myMessage);
		
		return;
	}

	async getMessages() {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));

		// #TODO dar um tempo mínimo de espera neste querySelector pois demora um pouco até carregar TODAS as mensagens
		let previousLength = 0;
		return new MessagesViewmodel(...[...await this.querySelectorAll('div[data-pre-plain-text]', (messageDivs, timeElapsed) => {
			if ((timeElapsed >= 5000) || (previousLength && previousLength == messageDivs.length))
				return true;
			else
				previousLength = messageDivs.length;
			return false;
		})].map(messageDiv => new MessageViewmodel(messageDiv.parentNode)));
	}
}