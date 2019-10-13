// #TODO Talvez fazer binding em alguns casos
// #TODO Ao criar as VIEWs, envolvê-las num Proxy
import {ChatController} from './ChatController';

export class ChatMapController extends Map {

	constructor(chatMap, chatMapView) {
		super();
		this._chatMap;
		this._chatMapView;
		this.refreshInterval = 10000;
		this.init(chatMap, chatMapView);
	}
	
	init(chatMap, chatMapView) {
		this._chatMap = chatMap;
		this._chatMapView = chatMapView;

		if (this._chatMap.size != this._chatMapView.size)
			throw new Error("Number of models and views doesn't match.");
		
		this._chatMap.forEach(([, chat]) => {
			const chatView = this.chatMapView.get(chat.title);
			if (!chatView)
				throw new Error(`There is no chat view called "${chat.title}"`);
			
			this.set(chat.title, new ChatController(chat, chatView));
		})

		setInterval(this.update.bind(this), this.refreshInterval)
	}

	update() {
		this.forEach(([, chatController]) => {
			if (chatController.hasNewMessage())
				chatController.update();
		})
	}
	
	addChat(chatController) {
		// boolean
	}

	// #TODO método para remover chat

	getChat(id) {
		// ChatController ou null se não existir	
	}

	getUnansweredChatMap() {
		// ChatMapController com os chats que tiverem mensagens novas, ou null se não houver
	}

	getNextUnansweredChat() {
		// qualquer ChatController com mensagem nova, ou null se não houver
	}
}