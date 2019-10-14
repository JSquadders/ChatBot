import {Chat} from '../models/Chat';
import {ChatView} from '../views/ChatView';

export class ChatController {
	constructor(chat, chatView) {
		this._chat = chat;
		this._chatView = chatView;
		this._bots = new Map();
	}

	addBot(bot) {
		bot.chatController = this;
		this._bots.set(bot.name, bot);
	}

	nBots() {
		return this._bots.size;
	}

	hasNewMessage() {
		return this._chatView.hasNewMessage();
	}

	update() {
		const newMessages = this._chatView.getMessages();
		const currentMessages = this._chat.getMessages();
		if (newMessages[0] != currentMessages[0] && newMessages[1] != currentMessages[1]) {
			this._chat.setMessages(newMessages);
			
			// #TODO onde considerar o tempo de resposta dos bots?
			for (const bot of this._bots.values()) {
				if (bot.ready)
				bot.answer();
			}
		}
	}

	setMessages(messages) {
		this._chat.setMessages(messages);
	}

	getMessages() {
		this._chat.getMessages();
	}
}