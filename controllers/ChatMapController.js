// #TODO Talvez fazer binding em alguns casos
// #TODO Ao criar as VIEWs, envolvê-las num Proxy
import {ChatController} from './ChatController';

export class ChatMapController extends Map {

	constructor(chatMap, chatMapView) {
		super();
		this._chatMap;
		this._chatMapView;
		this._intervalID;
		this._refreshInterval;
		this.init(chatMap, chatMapView);
	}

	listen() {
		if (this._intervalID)
			return false;

		this._intervalID = setInterval(this.update.bind(this), this.refreshInterval);
		return true;
	}

	pauseListening() {
		if (this._intervalID)
			clearInterval(this._intervalID);
		this._intervalID = 0;
	}

	set refreshInterval(value = 5000) {
		this._refreshInterval = value;
		if (this._intervalID) {
			clearInterval(this._intervalID);
			this.listen();
		}
	}

	get refreshInterval() {
		return this._refreshInterval;
	}
	
	init(chatMap, chatMapView) {
		this._chatMap = chatMap;
		this._chatMapView = chatMapView;
		this._intervalID = 0;
		this._refreshInterval = 5000;

		if (this._chatMap.size != this._chatMapView.size)
			throw new Error("Number of models and views doesn't match.");
		
		this._chatMap.forEach(([, chat]) => {
			const chatView = this.chatMapView.get(chat.title);
			if (!chatView)
				throw new Error(`There is no chat view called "${chat.title}"`);
			
			this.set(chat.title, new ChatController(chat, chatView));
		})
	}

	update() {
		// #TODO Promise
		this.pauseListening();
		let unansweredChat = this._chatMapView.getNextUnansweredChat();
		if (unansweredChat) {
			unansweredChat.getNewMessages().forEach(msg => this._chatMap[unansweredChat.title].addMessageToBeRead(msg));
			this._chatMap[unansweredChat.title].reply();
		}
	}
}