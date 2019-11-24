// #TODO Talvez fazer binding em alguns casos
// #TODO Ao criar as VIEWs, envolvê-las num Proxy
import { ChatController } from './ChatController';

export class ChatMapController extends Map {
	constructor(chatMap, chatMapView) {
		super();
		this._chatMap;
		this._chatMapView;
		this._intervalID;
		this._refreshInterval;
		this.init(chatMap, chatMapView);
	}

	init(chatMap, chatMapView) {
		this._chatMap = chatMap;
		this._chatMapView = chatMapView;
		this._intervalID = 0;
		this._refreshInterval = 3000;

		if (this._chatMap.size != this._chatMapView.size)
			throw "Number of models and views doesn't match.";
		
		this._chatMap.forEach(chat => {
			let chatView = this._chatMapView.get(chat.id);
			if (!chatView)
				throw `There is no chatview called "${chat.id}"`;
			
			this.set(chat.id, new ChatController(chat, chatView));
		})
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

	set refreshInterval(value = 3000) {
		this._refreshInterval = value;
		if (this._intervalID) {
			clearInterval(this._intervalID);
			this.listen();
		}
	}

	get refreshInterval() {
		return this._refreshInterval;
	}

	async update() {
		this.pauseListening();
		let unansweredChatView = await this._chatMapView.getNextUnansweredChat();
		if (unansweredChatView) {
			let newMessages = await unansweredChatView.popNewMessages();

			// #TODO guardar this._chatMap.get(unansweredChat.id) numa variavel
			let unansweredChat = this._chatMap.get(unansweredChatView.id);
			console.log('newMessages', newMessages);
			newMessages.forEach(message => unansweredChat.addMessageToBeRead(message.text));
			
			// usar await para facilitar
			unansweredChat.reply()
				.then(() => {
					unansweredChat.popMessagesToBeSent().forEach(message => unansweredChatView.postMessage(message));
					this.listen();
				}).catch(console.log);
		} else {
			// #todo melhorar lógica para evitar ter listen() 2x
			this.listen();
		}
	}
}