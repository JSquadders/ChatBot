import {ChatView} from '../ChatView';
import {MessagesViewModel} from '../viewmodels/MessagesViewModel';
import {MessageViewModel} from '../viewmodels/MessageViewModel';

export class ChatViewWhatsApp extends ChatView {
	constructor(id) {
		super(id);
		this._messagesViewModel = new MessagesViewModel();
	}

	async switch() {
		console.log('Switching to chat');
		document.querySelector(`span._1wjpf._3NFp9._3FXB1[title='${this._id}']`).dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		console.log('Waiting for page to load up');
		await this.querySelector(`header span[title='${this.id}']`, 1000);
		await this.querySelector('._3dGYA', 1000, (timeElapsed, currentElement) => ((timeElapsed >= 5000) || (currentElement.title === 'load earlier messages…')));
		console.log('Loaded');
	}

	parseMessage(msgDiv) {
		console.log('Parsing', msgDiv);
		let data = msgDiv.dataset.prePlainText;
		if (!data) throw 'Tried to create a MessageViewModel with a wrong DIV';
		if (msgDiv.querySelector('img')) throw 'Tried to parse a message with an emoji';
		if (msgDiv.querySelector('._3CVlE')) throw 'Tried to parse a reply message';

		let author = data.substr(0, data.length - 2).split('] ')[1];
		let text = [...msgDiv.firstChild.firstChild.firstChild.childNodes].reduce((finalText, element) => {
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

	async postMessage(msg) {
		await this.switch();
		console.log('Selecting input to send message');
		let input = await this.querySelector('footer div[contenteditable]', 1000, (timeElapsed, input) => {
			if (input) {
				if (input.textContent === '' || timeElapsed >= 5000)
					return input;
			}
			return false;
		});
		input.textContent = msg;
		input.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		console.log('Clicking send button');
		(await this.querySelector('button._35EW6', 1000)).click();

		let now = new Date();
		let myMessage = await this.querySelectorAll('div.message-out:nth-last-child(-n+5) div[data-pre-plain-text]', 1000, (timeElapsed, msgDivs) => {
			console.log('Retrieving message just sent');
			if (timeElapsed >= 5000)
				return msgDivs;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				if (!msgDivs[i].querySelector('._3CVlE') && !msgDivs[i].querySelector('img')) {
					let messageViewModel = this.parseMessage(msgDivs[i]);
					if (msg === messageViewModel.text && (now - messageViewModel.date <= 60000))
						return messageViewModel;
				}
			}
			return false;
		});
		
		console.log('Message sent', myMessage);		
		if (!!myMessage)
			this._messagesViewModel.push(myMessage);
	}

	async getMessages() {
		await this.switch();

		return new MessagesViewModel(...[...await this.querySelectorAll('div[data-pre-plain-text]', 2000, (timeElapsed, messageDivs, previousMessageDivs) => {
			console.log('Waiting for messages to load up');
			return ((timeElapsed >= 6000) || (previousMessageDivs.length && (previousMessageDivs.length == messageDivs.length))) ? (console.log('Loaded'), messageDivs) : false;
		})].reduce((result, messageDiv) => (!messageDiv.querySelector('._3CVlE') && !messageDiv.querySelector('img')) ? result.concat(this.parseMessage(messageDiv)) : result, [])
		);
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}