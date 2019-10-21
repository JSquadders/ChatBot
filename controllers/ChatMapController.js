// #TODO Talvez fazer binding em alguns casos
// #TODO Ao criar as VIEWs, envolvê-las num Proxy
// import {ChatController} from './ChatController';

/*export*/ class ChatMapController extends Map {

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
		this._refreshInterval = 5000;

		if (this._chatMap.size != this._chatMapView.size)
			throw new Error("Number of models and views doesn't match.");
		
		this._chatMap.forEach(chat => {
			const chatView = this._chatMapView.get(chat.id);
			if (!chatView)
				throw new Error(`There is no chat view called "${chat.id}"`);
			
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

	async update() {
		this.pauseListening();
		let unansweredChat = await this._chatMapView.getNextUnansweredChat();
		if (unansweredChat) {
			let newMessages = await unansweredChat.getNewMessages();

			// #TODO guardar this._chatMap.get(unansweredChat.id) numa variavel
			console.log(newMessages);
			newMessages.forEach(message => this._chatMap.get(unansweredChat.id).addMessageToBeRead(message.text));
			this._chatMap.get(unansweredChat.id).reply()
				.then(unansweredChat.postMessage.bind(unansweredChat))
				.catch(console.log);
		}
	}
}