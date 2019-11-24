export class ChatController {
	constructor(chat, chatView) {
		this._chat = chat;
		this._chatView = chatView;
		// #TODO criar propriedade id
	}

	async hasNewMessage() {
		return await this._chatView.hasNewMessage();
	}

	// #TODO não está em uso, mas talvez devesse
	update() {
	}

	messages() {
		this._chat.messages();
	}

	async addBot(bot) {
		this._chat.addBot(bot);
		await this._chatView.postMessage('```[' + bot.name + ':reset]```');
		await this._chatView.postMessage('```[' + bot.name + ':listening]```');
	}
}