export class ChatMapView extends Map {
	// Só ouve os chats que tiverem bot. #TODO Como saber?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.title, chatView]));
	}

	getNextUnansweredChat() {
		for (this.values() of chat) {
			if (chat.hasNewMessage())
				return chat;
		}
		return null;
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN')].map(span => span.title);
	}
}