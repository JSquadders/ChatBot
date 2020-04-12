import { ChatModel } from '../models/ChatModel';
import { ChatView } from '../views/ChatView';
import { Bot } from '../models/Bot';

export class ChatController {
	constructor(chatView) {
		if (!(chatView instanceof ChatView))
			throw `Invalid ChatView object: ${chatView}`;

		this._id = chatView.id;
		this._chatModel = new ChatModel(chatView.id);
		this._chatView = chatView;
	}

	get id() {
		return this._id;
	}

	getMessages() {
		return this._chatView.getMessages();
	}

	hasNewMessage() {
		return this._chatView.hasNewMessage();
	}

	async update() {
		if (await this.hasNewMessage()) {
			(await this.popNewMessages()).forEach(message => this.addMessageToBeRead(message.text));			
			await this.reply();
			this.popMessagesToBeSent().forEach(message => this.postMessage(message));
		}
	}

	// @todo Ambiguous with getMessages(). Give it a better name
	messages() {
		return this._chatModel.messages();
	}

	postMessage(message) {
		return this._chatView.postMessage(message);
	}
	
	popNewMessages() {
		return this._chatView.popNewMessages();
	}

	addMessageToBeRead(message) {
		return this._chatModel.addMessageToBeRead(message);
	}

	reply() {
		return this._chatModel.reply();
	}

	popMessagesToBeSent() {
		return this._chatModel.popMessagesToBeSent();
	}

	async addBot(botName) {
		this._chatModel.addBot(new Bot(botName));
		await this._chatView.postMessage('```[' + botName + ':reset]```');
		await this._chatView.postMessage('```[' + botName + ':listening]```');
	}
}