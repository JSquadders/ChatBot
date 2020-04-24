/* eslint-disable no-unused-vars */
import {MessagesViewModel} from './viewmodels/MessagesViewModel';
import {MessageViewModel} from './viewmodels/MessageViewModel';
/* eslint-enable no-unused-vars */

export class ChatView {
	constructor(id) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	/* eslint-disable no-cond-assign */
	/* eslint-disable no-unused-vars */
	querySelector(selector, interval, fulfillmentCallback = (timeElapsed, currentElement, previousElement) => (currentElement || timeElapsed >= 3000), rootElement = document) {
		/* eslint-enable no-unused-vars */
		return new Promise((resolve) => {
			let result = [], currentElement, previousElement = null, timeElapsed = 0;
			
			void function _querySelector() {
				currentElement = rootElement.querySelector(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElement, (previousElement || currentElement))) {
					resolve((result === true) ? null : result);
				} else {
					previousElement = currentElement;
					setTimeout(_querySelector, interval);
				}
			}();
		});
	}

	/* eslint-disable no-unused-vars */
	querySelectorAll(selector, interval, fulfillmentCallback = (timeElapsed, currentElements, previousElements) => ((currentElements.length || timeElapsed >= 3000) ? currentElements : false), rootElement = document) {
		/* eslint-enable no-unused-vars */
		return new Promise((resolve) => {
			let result = [], currentElements, previousElements = [], timeElapsed = 0;
			
			void function _querySelectorAll() {
				currentElements = rootElement.querySelectorAll(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElements, (previousElements || currentElements))) {
					resolve(result);
				} else {
					previousElements = currentElements;
					setTimeout(_querySelectorAll, interval);
				}
			}();
		});
	}
	/* eslint-enable no-cond-assign */

	hasNewMessage() {
		console.log('Checking for new messages');
		return new Promise(async (resolve) => {
			resolve((await this.getMessages()).reverse().some(msgViewModel => (this._messagesViewModel.has(msgViewModel) ? false : (console.log('New message', msgViewModel), true))));
		});
	}

	popNewMessages() {
		console.log('Popping new messages');
		return new Promise(async (resolve) => {
			let newMessages = (await this.getMessages()).remove(this._messagesViewModel);
			console.log('New messages', newMessages);
			newMessages.forEach(newMessage => this._messagesViewModel.push(newMessage));
			resolve(newMessages);
		});
	}

	/* eslint-disable no-unused-vars */
	async postMessage(msg) {
		/* eslint-enable no-unused-vars */
		throw 'async postMessage() must be implemented.';
	}
	
	async getMessages() {
		throw 'async getMessages() must be implemented.';
	}
}