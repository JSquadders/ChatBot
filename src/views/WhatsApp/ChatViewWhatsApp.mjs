import { ChatView } from '../ChatView';
import { MessagesViewModel } from '../viewmodels/MessagesViewModel';
import { MessageViewModel } from '../viewmodels/MessageViewModel';

export class ChatViewWhatsApp extends ChatView {
	constructor(id) {
		super(id);
		this._messagesViewModel = new MessagesViewModel();
	}

	async switch() {
		console.log('Switching to chat');
		document.querySelector(`span._1wjpf._3NFp9._3FXB1[title='${this._id}']`).dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		console.log('Waiting for page to load');
		await this.querySelector(`header span[title='${this.id}']`, 1000);
		await this.querySelector('._3dGYA', 1000, (timeElapsed, currentElement) => ((timeElapsed >= 5000) || (currentElement.title === 'load earlier messages…')));
		console.log('Loaded');
	}

	parseMessage(messageDiv) {
		console.log('Parsing', messageDiv);
		
		let data = messageDiv.dataset.prePlainText;
		if (!data) {
			console.error('Tried to create a MessageViewModel with a wrong DIV:', messageDiv);
			throw 'A MessageViewModel must have author, text and date';
		}

		let author = data.substr(0, data.length - 2).split('] ')[1];

		let text = [...messageDiv.firstChild.firstChild.firstChild.childNodes].reduce((finalText, element) => {
			let node = element.nodeValue;
			if (!node && (node !== '') && element.dataset.appTextTemplate) {
				let template = element.dataset.appTextTemplate;
				let decoration = template.substr(0, template.indexOf('$'));
				node = decoration + element.textContent + decoration;
			}
			return (node ? finalText.concat(node) : finalText);
		}, '');

		data = [...data.matchAll(/\d+/g)];
		let date = new Date(data[4], data[2] - 1, data[3], data[0], data[1]);

		let message = new MessageViewModel(author, text, date);
		return message;
	}

	async postMessage(message) {
		await this.switch();
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

		let now = new Date();

		console.log('Retrieving message just sent');
		let myMessage = await this.querySelectorAll('div.message-out:nth-last-child(-n+5) div[data-pre-plain-text]', 1000, (timeElapsed, msgDivs) => {
			if (timeElapsed >= 5000)
				return msgDivs;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				let messageViewModel = this.parseMessage(msgDivs[i]);
				if (message === messageViewModel.text && (now - messageViewModel.date <= 60000))
					return messageViewModel;
			}
			return false;
		});
		
		console.log('Message sent', myMessage);		
		if (!!myMessage)
			this._messagesViewModel.push(myMessage);
	}

	async getMessages() {
		await this.switch();

		let previousLength = 0;
		return new MessagesViewModel(...[...await this.querySelectorAll('div[data-pre-plain-text]', 2000, (timeElapsed, messageDivs) => {
			if ((timeElapsed >= 6000) || (previousLength && (previousLength == messageDivs.length)))
				return messageDivs;
			else
				previousLength = messageDivs.length;
			return false;
		})].map(messageDiv => this.parseMessage(messageDiv)));
	}
}