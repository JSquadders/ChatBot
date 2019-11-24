export class ChatMapView extends Map {
	// Só ouve os chats que tiverem bot. #TODO Como saber?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.id, chatView]));
	}

	async getNextUnansweredChat() {
		for (let chatView of this.values()) {
			if (await chatView.hasNewMessage())
				return chatView;
		}
		return null;
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}