import { MessageViewmodel } from './viewmodels/MessageViewmodel.mjs';
import { MessagesViewmodel } from './viewmodels/MessagesViewmodel.mjs';

export class ChatView {
	constructor(id) {
		// Pode ser o nome da conversa, do grupo ou da pessoa
		this._id = id;
		this._messagesViewmodel = new MessagesViewmodel();
	}

	/* eslint-disable no-cond-assign */
	
	/* eslint-disable no-unused-vars */
	querySelector(selector, interval, fulfillmentCallback = (timeElapsed, currentElement, previousElement) => (currentElement || timeElapsed >= 10000), rootElement = document) {
		/* eslint-enable no-unused-vars */
		return new Promise((resolve) => {
			let result = [], currentElement, previousElement = null, timeElapsed = 0;
			
			(function _querySelector() {
				currentElement = rootElement.querySelector(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElement, (previousElement || currentElement))) {
					resolve((result === true) ? null : result);
				} else {
					previousElement = currentElement;
					setTimeout(_querySelector, interval);
				}
			})();
		});
	}

	/* eslint-disable no-unused-vars */
	querySelectorAll(selector, interval, fulfillmentCallback = (timeElapsed, currentElements, previousElements) => ((currentElements.length || timeElapsed >= 5000) ? currentElements : false), rootElement = document) {
		/* eslint-enable no-unused-vars */
		return new Promise((resolve) => {
			let result = [], currentElements, previousElements = null, timeElapsed = 0;
			
			(function _querySelectorAll() {
				currentElements = rootElement.querySelectorAll(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElements, (previousElements || currentElements))) {
					resolve(result);
				} else {
					previousElements = currentElements;
					setTimeout(_querySelectorAll, interval);
				}
			})();
		});
	}

	/* eslint-enable no-cond-assign */

	get id() {
		return this._id;
	}

	hasNewMessage() {
		return new Promise(async (resolve) => {
			let oldMessagesJSON = this._messagesViewmodel.map(messageViewmodel => JSON.stringify(messageViewmodel));
			resolve(!!(await this.getMessages()).filter(messageViewmodel => (messageViewmodel.datetime >= this._messagesViewmodel.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageViewmodel)))).length);
		});
	}

	// #TODO checar se não dá problema conforme o scroll avança, já que as mensagens antigas são destruídas na renderização do React
	popNewMessages() {
		return new Promise(async (resolve) => {
			let newMessages = (await this.getMessages()).remove(this._messagesViewmodel);
			newMessages.forEach(newMessage => this._messagesViewmodel.push(newMessage));
			resolve(newMessages);
		});
	}

	async postMessage(message) {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		await this.querySelector('header span[title="' + this.id + '"]', 1000);
		let chat = await this.querySelector('._3u328', 1000, (timeElapsed, input) => {
			if (input) {
				if (input.textContent === '' || timeElapsed >= 5000)
					return input;
			}
			return false;
		});
		chat.textContent = message;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		(await this.querySelector('._3M-N-', 1000)).click();

		let myMessage;
		let now = new Date();

		// #todo está ruim atribuir messageViewModel dentro do querySelector
		await this.querySelectorAll('div.message-out div[data-pre-plain-text]', 1000, (timeElapsed, msgDivs) => {
			if (timeElapsed >= 5000)
				return msgDivs;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				let messageViewmodel = new MessageViewmodel(msgDivs[i]);
				console.log(messageViewmodel);
				if (message === messageViewmodel.text && (now - messageViewmodel.datetime <= 60000)) {
					myMessage = messageViewmodel;
					return msgDivs;
				}
			}
			return false;
		});
		
		if (!!myMessage)
			this._messagesViewmodel.push(myMessage);
		
		// console.log('myMessage', myMessage);	
	}

	async getMessages() {
		document.querySelector('span._19RFN[title="' + this.id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));

		// #TODO dar um tempo mínimo de espera neste querySelector pois demora um pouco até carregar TODAS as mensagens
		let previousLength = 0;
		return new MessagesViewmodel(...[...await this.querySelectorAll('div[data-pre-plain-text]', 1000, (timeElapsed, messageDivs) => {
			if ((timeElapsed >= 5000) || (previousLength && previousLength == messageDivs.length))
				return messageDivs;
			else
				previousLength = messageDivs.length;
			return false;
		})].map(messageDiv => new MessageViewmodel(messageDiv)));
	}
}