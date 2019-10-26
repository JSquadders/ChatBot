/*export*/ class MessageViewmodel {
	
	constructor(messageDiv) {
		let data = messageDiv.firstChild.getAttribute('data-pre-plain-text');
		if (!data)
			throw new Error('a MessageViewmodel must have sender, text and datetime');
		
		this._sender = data.substr(0, data.length - 2).split('] ')[1];
		
		let span = messageDiv.firstChild.firstChild.firstChild.firstChild;
		this._text = [...span.childNodes].reduce((finalText, node) => {
			let text = node.nodeValue;
			let template = node.getAttribute('data-app-text-template');
			if (!text && template) {
				console.log(node);
				let decoration = template.substr(0, template.indexOf('$'));
				text = decoration + node.textContent + decoration;
			}
			return finalText.concat(text);
		}, '');
		
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

	set datetime(value) {
		return this._datetime = value;
	}

	set sender(value) {
		return this._sender = value;
	}

	set text(value) {
		return this._text = value;
	}
}