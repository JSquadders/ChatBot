import { MessagesViewModel } from './viewmodels/MessagesViewModel';
import { MessageViewModel } from './viewmodels/MessageViewModel';

export class ChatView {
	constructor(id) {
		this._id = id;
		this._messagesViewModel = new MessagesViewModel();
	}

	/* eslint-disable no-cond-assign */
	/* eslint-disable no-unused-vars */
	querySelector(selector, interval, fulfillmentCallback = (timeElapsed, currentElement, previousElement) => (currentElement || timeElapsed >= 3000), rootElement = document) {
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
	querySelectorAll(selector, interval, fulfillmentCallback = (timeElapsed, currentElements, previousElements) => ((currentElements.length || timeElapsed >= 3000) ? currentElements : false), rootElement = document) {
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
			let oldMessagesJSON = this._messagesViewModel.map(messageViewModel => JSON.stringify(messageViewModel));
			resolve(!!(await this.getMessages()).filter(messageViewModel => (messageViewModel.datetime >= this._messagesViewModel.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageViewModel)))).length);
		});
	}

	popNewMessages() {
		return new Promise(async (resolve) => {
			let newMessages = (await this.getMessages()).remove(this._messagesViewModel);
			newMessages.forEach(newMessage => this._messagesViewModel.push(newMessage));
			resolve(newMessages);
		});
	}

	async postMessage(message) {
		console.log('Switching to chat');		
		document.querySelector('span._1wjpf._3NFp9._3FXB1[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		console.log('Waiting for page to open');
		await this.querySelector('header span[title="' + this.id + '"]', 1000);
		console.log('Selecting input to send message');
		let input = await this.querySelector('footer div[contenteditable]', 1000, (timeElapsed, input) => {
			if (input) {
				if (input.textContent === '' || timeElapsed >= 5000)
					return input;
			}
			return false;
		});
		input.textContent = message;
		input.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		console.log('Clicking send button');
		(await this.querySelector('button._35EW6', 1000)).click();

		let myMessage;
		let now = new Date();

		console.log('Retrieving message just sent');
		// @todo messageViewModel is being assigned inside the 'querySelector', which is not really nice.
		await this.querySelectorAll('div.message-out div[data-pre-plain-text]', 1000, (timeElapsed, msgDivs) => {
			if (timeElapsed >= 5000)
				return msgDivs;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				let messageViewModel = new MessageViewModel(msgDivs[i]);
				console.log(messageViewModel);
				if (message === messageViewModel.text && (now - messageViewModel.datetime <= 60000)) {
					myMessage = messageViewModel;
					return msgDivs;
				}
			}
			return false;
		});
		
		if (!!myMessage)
			this._messagesViewModel.push(myMessage);
	}

	async getMessages() {
		document.querySelector('span._1wjpf._3NFp9._3FXB1[title="' + this.id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));

		// @todo Provide an initial delay to make sure all the messages have been loaded
		let previousLength = 0;
		return new MessagesViewModel(...[...await this.querySelectorAll('div[data-pre-plain-text]', 1000, (timeElapsed, messageDivs) => {
			if ((timeElapsed >= 5000) || ((document.querySelector('._3dGYA').title === 'load earlier messages…') && previousLength && (previousLength == messageDivs.length)))
				return messageDivs;
			else
				previousLength = messageDivs.length;
			return false;
		})].map(messageDiv => new MessageViewModel(messageDiv)));
	}
}