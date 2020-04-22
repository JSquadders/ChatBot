export class ChatControllerMap extends Map {
	constructor(...chatControllers) {
		super(chatControllers.map((chatController) => [chatController.id, chatController]));
		this._timeoutID = null;
		this._refreshInterval = 6000;
	}

	async listen() {
		this._timeoutID = true;
		
		(async function _listen() {
			console.log('Checking messages');
			await this.update();

			if (this._timeoutID)
				this._timeoutID = setTimeout(_listen.bind(this), this._refreshInterval);
		}).bind(this)();
	}

	stop() {
		if (this._timeoutID)
			clearInterval(this._timeoutID);
		this._timeoutID = null;
	}

	async getNextUnansweredChatController() {
		for (let chatController of this.values()) {
			if (await chatController.hasNewMessage())
				return chatController;
		}
		return null;
	}

	async update() {
		let unansweredChatController = await this.getNextUnansweredChatController();
		if (unansweredChatController)
			await unansweredChatController.update();
	}

	set refreshInterval(ms) {
		this._refreshInterval = ms;
		if (this._timeoutID) {
			clearInterval(this._timeoutID);
			this.listen();
		}
	}

	get refreshInterval() {
		return this._refreshInterval;
	}
}