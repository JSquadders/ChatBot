/*export*/ class ChatMapView extends Map {
	// Só ouve os chats que tiverem bot. #TODO Como saber?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.id, chatView]));
	}

	getNextUnansweredChat() {
		for (let chat of this.values()) {
			if (chat.hasNewMessage())
				return chat;
		}
		return null;
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}