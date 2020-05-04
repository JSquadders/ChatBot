class ChatControllerMap extends Map {
	constructor(...chatControllers) {
		super(chatControllers.map((chatController) => [chatController.id, chatController]));
		this._timeoutID = null;
		this._refreshInterval = 6000;
	}

	set(...args) {
		if (args.length === 1) super.set(args[0].id, args[0]);
		else super.set(args[0], args[1]);
	}

	async listen() {
		this._timeoutID = true;
		
		void async function _listen() {
			console.log('Checking messages');
			await this.update();

			if (this._timeoutID)
				this._timeoutID = setTimeout(_listen.bind(this), this._refreshInterval);
		}.call(this);
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

const chatControllerMap = new ChatControllerMap();
export default chatControllerMap;