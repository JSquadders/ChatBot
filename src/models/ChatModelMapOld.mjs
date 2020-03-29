export class ChatModelMap extends Map {
	constructor(...chats) {
		super(chats.map(chat => [chat.id, chat]));
	}
}