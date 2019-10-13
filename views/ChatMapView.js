export class ChatMapView extends Map {
	// Só ouve os chats que tiverem bot. #TODO Como saber?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.title, chatView]));
	}

	static getAllChatsTitles() {
	}
}