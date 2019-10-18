/*export*/ class MessageView {
	
	constructor(messageDiv) {

		// #TODO parsear o sender direito
		// #TODO criar get e set
		let data = messageDiv.firstChild.getAttribute('data-pre-plain-text');

		if (!data)
			throw new Error('a MessageView must have sender, text and datetime');

		this._sender = data.substr(0, data.length - 2).split(']')[1];
		this._text = messageDiv.firstChild.firstChild.firstChild.firstChild.textContent;
		this._datetime = new Date(data.substr(14, 4), data.substr(8, 2) - 1, data.substr(11, 2), data.substr(1, 2), data.substr(4, 2));
	}

	get datetime() {
		return this._datetime;
	}

	get sender() {
		return this._sender;
	}

	get text() {
		return this._text;
	}
}