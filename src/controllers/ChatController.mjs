import ChatModel from '../models/ChatModel';
import ChatView from '../views/ChatView';
import Bot from '../models/Bot';

export default class ChatController {
	constructor(chatView) {
		if (!(chatView instanceof ChatView))
			throw new TypeError(`Invalid ChatView object: ${chatView}`);

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
			(await this.popNewMessages()).forEach(msg => this.addMessageToBeRead(msg.text));			
			await this.reply();
			this.popMessagesToBeSent().forEach(msg => this.postMessage(msg));
		}
	}

	postMessage(msg) {
		return this._chatView.postMessage(msg);
	}
	
	popNewMessages() {
		return this._chatView.popNewMessages();
	}

	addMessageToBeRead(msg) {
		return this._chatModel.addMessageToBeRead(msg);
	}

	reply() {
		return this._chatModel.reply();
	}

	popMessagesToBeSent() {
		return this._chatModel.popMessagesToBeSent();
	}

	async addBot(botName) {
		this._chatModel.addBot(new Bot(botName));
		await this._chatView.postMessage(`[${botName}:reset]`);
		await this._chatView.postMessage(`[${botName}:listening]`);
	}
}