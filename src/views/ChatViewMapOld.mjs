export class ChatViewMap extends Map {
	// @todo How to make it listen only to chats that have bots?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.id, chatView]));
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}