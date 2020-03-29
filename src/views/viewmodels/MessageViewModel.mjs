export class MessageViewModel {
	constructor(messageDiv) {
		console.log('Parsing message', messageDiv);
		
		let data = messageDiv.getAttribute('data-pre-plain-text');
		if (!data) {
			console.error('tried to create a MessageViewModel with a wrong DIV:', messageDiv);
			throw 'a MessageViewModel must have sender, text and datetime';
		}
		
		this._sender = data.substr(0, data.length - 2).split('] ')[1];
		
		let span = messageDiv.firstChild.firstChild.firstChild;
		this._text = [...span.childNodes].reduce((finalText, element) => {
			let text = element.nodeValue;
			if (!text && (text !== '') && element.hasAttribute('data-app-text-template')) {
				let template = element.getAttribute('data-app-text-template');
				let decoration = template.substr(0, template.indexOf('$'));
				text = decoration + element.textContent + decoration;
			}
			return (text ? finalText.concat(text) : finalText);
		}, '');

		data = [...data.matchAll(/\d+/g)];
		this._datetime = new Date(data[4], data[2] - 1, data[3], data[0], data[1]);
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