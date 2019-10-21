// import {Chat} from '../models/Chat';
// import {ChatView} from '../views/ChatView';

/*export*/ class ChatController {
	constructor(chat, chatView) {
		this._chat = chat;
		this._chatView = chatView;
	}

	async hasNewMessage() {
		return await this._chatView.hasNewMessage();
	}

	// #TODO aparentemente não está mais em uso
	update() {
		const newMessages = this._chatView.getMessages();
		const currentMessages = this._chat.getMessages();
		if (newMessages[0] != currentMessages[0] && newMessages[1] != currentMessages[1]) {
			this._chat.setMessages(newMessages);
		}
	}

	setMessages(messages) {
		this._chat.setMessages(messages);
	}

	getMessages() {
		this._chat.getMessages();
	}

	addBot(bot) {
		this._chat.addBot(bot);
	}
}