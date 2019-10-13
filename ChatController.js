export class ChatController {
	constructor(chat, chatView) {
		this._chat = Chat();
		this._chatView = ChatView();
		this._bots = new Map();
	}

	get bots() {
		return this._bots;
	}

	get chat() {
		return this._chat;
	}

	get chatView() {
		return this._chatView;
	}
}