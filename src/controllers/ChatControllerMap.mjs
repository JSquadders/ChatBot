// @todo Maybe bind some cases
// @todo Wrap Views inside a Proxy

export class ChatControllerMap extends Map {
	constructor(...chatControllers) {
		super(chatControllers.map((chatController) => [chatController.id, chatController]));
		this._intervalID = 0;
		this._refreshInterval = 3000;
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

	async getNextUnansweredChatController() {
		for (let chatController of this.values()) {
			if (await chatController.hasNewMessage())
				return chatController;
		}
		return null;
	}

	async update() {
		this.pauseListening();
		let unansweredChatController = await this.getNextUnansweredChatController();
		if (unansweredChatController) {
			let newMessages = await unansweredChatController.popNewMessages();

			console.log('newMessages', newMessages);
			newMessages.forEach(message => unansweredChatController.addMessageToBeRead(message.text));
			
			// @todo Use await to simplify
			unansweredChatController.reply()
				.then(() => {
					unansweredChatController.popMessagesToBeSent().forEach(message => unansweredChatController.postMessage(message));
					this.listen();
				}).catch(console.log);
		} else {
			// @todo Improve algorithm in order to avoid calling listen() twice
			this.listen();
		}
	}
	
	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}