export class MessageViewModel {
	constructor(author, text, date) {
		if (!author || !text || !date)
			throw `Could not create a MessageViewModel with author "${author}", text "${text}" and date "${date}"`;

		this._author = author;
		this._text = text;
		this._date = date;
	}

	get date() {
		return this._date;
	}

	get author() {
		return this._author;
	}

	get text() {
		return this._text;
	}

	set date(value) {
		return this._date = value;
	}

	set author(value) {
		return this._author = value;
	}

	set text(value) {
		return this._text = value;
	}
}