class MessageViewmodel {
	constructor(messageDiv) {
		let data = messageDiv.getAttribute('data-pre-plain-text');
		if (!data) {
			console.error('tried to create a MessageViewmodel with a wrong DIV:', messageDiv);
			throw 'a MessageViewmodel must have sender, text and datetime';
		}
		
		this._sender = data.substr(0, data.length - 2).split('] ')[1];
		
		let span = messageDiv.firstChild.firstChild.firstChild;
		this._text = [...span.childNodes].reduce((finalText, element) => {
			let text = element.nodeValue;
			if (!text && element.hasAttribute('data-app-text-template')) {
				let template = element.getAttribute('data-app-text-template');
				let decoration = template.substr(0, template.indexOf('$'));
				text = decoration + element.textContent + decoration;
			}
			return (text ? finalText.concat(text) : finalText);
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

class MessagesViewmodel extends Array {
	constructor(...messageViewmodels) {
		super();
		this.lastChecked = 0;
		messageViewmodels.forEach(messageViewmodel => this.push(messageViewmodel));
	}

	push(messageViewmodel) {
		if (messageViewmodel.sender && messageViewmodel.text) {
			if (messageViewmodel.datetime > this.lastChecked)
				this.lastChecked = messageViewmodel.datetime;
			return super.push(messageViewmodel);
		}
		return false;
	}

	remove(messagesViewmodel) {
		let result = [];
		let _messagesViewmodel = [...messagesViewmodel];
		this.forEach(thisMessageViewmodel => {
			let foundIndex = _messagesViewmodel.findIndex(messageViewmodel => (thisMessageViewmodel.sender == messageViewmodel.sender) && (thisMessageViewmodel.text == messageViewmodel.text) && (Math.abs(thisMessageViewmodel.datetime - messageViewmodel.datetime) <= 60000));
			if (foundIndex > -1)
				_messagesViewmodel.splice(foundIndex, 1);
			else
				result.push(thisMessageViewmodel);
		});
		return result;
	}
}

class ChatView {
	constructor(id) {
		// Pode ser o nome da conversa, do grupo ou da pessoa
		this._id = id;
		this._messagesViewmodel = new MessagesViewmodel();
	}

	querySelector(selector, interval, fulfillmentCallback = (timeElapsed, currentElement, previousElement) => (currentElement || timeElapsed >= 10000), rootElement = document) {
		return new Promise((resolve) => {
			let result = [], currentElement, previousElement = null, timeElapsed = 0;
			
			(function _querySelector() {
				currentElement = rootElement.querySelector(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElement, (previousElement || currentElement))) {
					resolve((result === true) ? null : result);
				} else {
					previousElement = currentElement;
					setTimeout(_querySelector, interval);
				}
			})();
		});
	}

	querySelectorAll(selector, interval, fulfillmentCallback = (timeElapsed, currentElements, previousElements) => ((currentElements.length || timeElapsed >= 5000) ? currentElements : false), rootElement = document) {
		return new Promise((resolve) => {
			let result = [], currentElements, previousElements = null, timeElapsed = 0;
			
			(function _querySelectorAll() {
				currentElements = rootElement.querySelectorAll(selector);
				if (result = fulfillmentCallback(timeElapsed += +interval, currentElements, (previousElements || currentElements))) {
					resolve(result);
				} else {
					previousElements = currentElements;
					setTimeout(_querySelectorAll, interval);
				}
			})();
		});
	}

	get id() {
		return this._id;
	}

	hasNewMessage() {
		return new Promise(async (resolve, reject) => {
			let oldMessagesJSON = this._messagesViewmodel.map(messageViewmodel => JSON.stringify(messageViewmodel));
			resolve(!!(await this.getMessages()).filter(messageViewmodel => (messageViewmodel.datetime >= this._messagesViewmodel.lastChecked && !oldMessagesJSON.includes(JSON.stringify(messageViewmodel)))).length);
		});
	}

	// #TODO checar se não dá problema conforme o scroll avança, já que as mensagens antigas são destruídas na renderização do React
	popNewMessages() {
		return new Promise(async (resolve, reject) => {
			let newMessages = (await this.getMessages()).remove(this._messagesViewmodel);
			newMessages.forEach(newMessage => this._messagesViewmodel.push(newMessage));
			resolve(newMessages);
		});
	}

	async postMessage(message) {
		document.querySelector('span._19RFN[title="' + this._id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
		await this.querySelector('header span[title="' + this.id + '"]', 1000);
		let chat = await this.querySelector('._3u328', 1000, (timeElapsed, input) => {
			if (input) {
				if (input.textContent === '' || timeElapsed >= 5000)
					return input;
			}
			return false;
		});
		chat.textContent = message;
		chat.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, view: window}));
		(await this.querySelector('._3M-N-', 1000)).click();

		let myMessage;
		let now = new Date();

		// #todo está ruim atribuir messageViewModel dentro do querySelector
		await this.querySelectorAll('div.message-out div[data-pre-plain-text]', 1000, (timeElapsed, msgDivs) => {
			if (timeElapsed >= 5000)
				return msgDivs;
			for	(let i = msgDivs.length - 1; i >= 0; i--) {
				let messageViewmodel = new MessageViewmodel(msgDivs[i]);
				console.log(messageViewmodel);
				if (message === messageViewmodel.text && (now - messageViewmodel.datetime <= 60000)) {
					myMessage = messageViewmodel;
					return msgDivs;
				}
			}
			return false;
		});
		
		if (!!myMessage)
			this._messagesViewmodel.push(myMessage);
		
		// console.log('myMessage', myMessage);	
	}

	async getMessages() {
		document.querySelector('span._19RFN[title="' + this.id + '"]').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));

		// #TODO dar um tempo mínimo de espera neste querySelector pois demora um pouco até carregar TODAS as mensagens
		let previousLength = 0;
		return new MessagesViewmodel(...[...await this.querySelectorAll('div[data-pre-plain-text]', 1000, (timeElapsed, messageDivs) => {
			if ((timeElapsed >= 5000) || (previousLength && previousLength == messageDivs.length))
				return messageDivs;
			else
				previousLength = messageDivs.length;
			return false;
		})].map(messageDiv => new MessageViewmodel(messageDiv)));
	}
}

class ChatMapView extends Map {
	// Só ouve os chats que tiverem bot. #TODO Como saber?
	constructor(...chatViews) {
		super(chatViews.map(chatView => [chatView.id, chatView]));
	}

	async getNextUnansweredChat() {
		for (let chatView of this.values()) {
			if (await chatView.hasNewMessage())
				return chatView;
		}
		return null;
	}

	static getAllChatsTitles() {
		return [...document.querySelectorAll('._19RFN[title]')].map(span => span.title);
	}
}

const _g = '0123456789abcdef'.split('');

class Cryptography {	
	static _f(p) {
		let o = '', m = 0;
		for (; m < 4; m++) {
			o += _g[(p >> (m * 8 + 4)) & 15] + _g[(p >> (m * 8)) & 15];
		}
		return o
	}
	
	static _d(n, m) {
		return (n + m) & 4294967295
	}
	
	static _j(u, o, n, m, r, p) {
		o = this._d(this._d(o, u), this._d(m, p));
		return this._d((o << r) | (o >>> (32 - r)), n)
	}
	
	static _e(o, n, u, r, m, q, p) {
		return this._j(n ^ u ^ r, o, n, m, q, p)
	}
	
	static _k(o, n, u, r, m, q, p) {
		return this._j(u ^ (n | (~r)), o, n, m, q, p)
	}
	
	static _h(o, n, u, r, m, q, p) {
		return this._j((n & r) | (u & (~r)), o, n, m, q, p)
	}
	
	static _a(o, n, u, r, m, q, p) {
		return this._j((n & u) | ((~n) & r), o, n, m, q, p)
	}
	
	static _c(n, p) {
		let o = n[0], m = n[1], r = n[2], q = n[3];
		o = this._a(o, m, r, q, p[0], 7, - 680876936);
		q = this._a(q, o, m, r, p[1], 12, - 389564586);
		r = this._a(r, q, o, m, p[2], 17, 606105819);
		m = this._a(m, r, q, o, p[3], 22, - 1044525330);
		o = this._a(o, m, r, q, p[4], 7, - 176418897);
		q = this._a(q, o, m, r, p[5], 12, 1200080426);
		r = this._a(r, q, o, m, p[6], 17, - 1473231341);
		m = this._a(m, r, q, o, p[7], 22, - 45705983);
		o = this._a(o, m, r, q, p[8], 7, 1770035416);
		q = this._a(q, o, m, r, p[9], 12, - 1958414417);
		r = this._a(r, q, o, m, p[10], 17, - 42063);
		m = this._a(m, r, q, o, p[11], 22, - 1990404162);
		o = this._a(o, m, r, q, p[12], 7, 1804603682);
		q = this._a(q, o, m, r, p[13], 12, - 40341101);
		r = this._a(r, q, o, m, p[14], 17, - 1502002290);
		m = this._a(m, r, q, o, p[15], 22, 1236535329);
		o = this._h(o, m, r, q, p[1], 5, - 165796510);
		q = this._h(q, o, m, r, p[6], 9, - 1069501632);
		r = this._h(r, q, o, m, p[11], 14, 643717713);
		m = this._h(m, r, q, o, p[0], 20, - 373897302);
		o = this._h(o, m, r, q, p[5], 5, - 701558691);
		q = this._h(q, o, m, r, p[10], 9, 38016083);
		r = this._h(r, q, o, m, p[15], 14, - 660478335);
		m = this._h(m, r, q, o, p[4], 20, - 405537848);
		o = this._h(o, m, r, q, p[9], 5, 568446438);
		q = this._h(q, o, m, r, p[14], 9, - 1019803690);
		r = this._h(r, q, o, m, p[3], 14, - 187363961);
		m = this._h(m, r, q, o, p[8], 20, 1163531501);
		o = this._h(o, m, r, q, p[13], 5, - 1444681467);
		q = this._h(q, o, m, r, p[2], 9, - 51403784);
		r = this._h(r, q, o, m, p[7], 14, 1735328473);
		m = this._h(m, r, q, o, p[12], 20, - 1926607734);
		o = this._e(o, m, r, q, p[5], 4, - 378558);
		q = this._e(q, o, m, r, p[8], 11, - 2022574463);
		r = this._e(r, q, o, m, p[11], 16, 1839030562);
		m = this._e(m, r, q, o, p[14], 23, - 35309556);
		o = this._e(o, m, r, q, p[1], 4, - 1530992060);
		q = this._e(q, o, m, r, p[4], 11, 1272893353);
		r = this._e(r, q, o, m, p[7], 16, - 155497632);
		m = this._e(m, r, q, o, p[10], 23, - 1094730640);
		o = this._e(o, m, r, q, p[13], 4, 681279174);
		q = this._e(q, o, m, r, p[0], 11, - 358537222);
		r = this._e(r, q, o, m, p[3], 16, - 722521979);
		m = this._e(m, r, q, o, p[6], 23, 76029189);
		o = this._e(o, m, r, q, p[9], 4, - 640364487);
		q = this._e(q, o, m, r, p[12], 11, - 421815835);
		r = this._e(r, q, o, m, p[15], 16, 530742520);
		m = this._e(m, r, q, o, p[2], 23, - 995338651);
		o = this._k(o, m, r, q, p[0], 6, - 198630844);
		q = this._k(q, o, m, r, p[7], 10, 1126891415);
		r = this._k(r, q, o, m, p[14], 15, - 1416354905);
		m = this._k(m, r, q, o, p[5], 21, - 57434055);
		o = this._k(o, m, r, q, p[12], 6, 1700485571);
		q = this._k(q, o, m, r, p[3], 10, - 1894986606);
		r = this._k(r, q, o, m, p[10], 15, - 1051523);
		m = this._k(m, r, q, o, p[1], 21, - 2054922799);
		o = this._k(o, m, r, q, p[8], 6, 1873313359);
		q = this._k(q, o, m, r, p[15], 10, - 30611744);
		r = this._k(r, q, o, m, p[6], 15, - 1560198380);
		m = this._k(m, r, q, o, p[13], 21, 1309151649);
		o = this._k(o, m, r, q, p[4], 6, - 145523070);
		q = this._k(q, o, m, r, p[11], 10, - 1120210379);
		r = this._k(r, q, o, m, p[2], 15, 718787259);
		m = this._k(m, r, q, o, p[9], 21, - 343485551);
		n[0] = this._d(o, n[0]);
		n[1] = this._d(m, n[1]);
		n[2] = this._d(r, n[2]);
		n[3] = this._d(q, n[3]);
	}
	
	static _i(p) {
		// let txt = '';
		let r = p.length, q = [1732584193, - 271733879, - 1732584194, 271733878], o;
		for (o = 64; o <= p.length; o += 64) {
			this._c(q, l(p.substring(o - 64, o)));
		}
		p = p.substring(o - 64);
		let m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (o = 0; o < p.length; o++) {
			m[o >> 2] |= p.charCodeAt(o) << ((o % 4) << 3);
		}
		m[o >> 2] |= 128 << ((o % 4) << 3);
		if (o > 55) {
			this._c(q, m);
			for (o = 0; o < 16; o++) {
				m[o] = 0;
			}
		}
		m[14] = r * 8;
		this._c(q, m);
		return q
	}
		
	static _b(m) {
		for (let n = 0; n < m.length; n++) {
			m[n] = this._f(m[n]);
		}
		return m.join('')
	}
	
	static md5(m) {
		return this._b(this._i(m));
	}

	static messageEncode(msg) {
		let msgEncoded = '', sBuffer = '';
		for (let i = 0; i <= msg.length; i++) {
			if (msg.charCodeAt(i) > 255) {
				sBuffer = escape(msg.charAt(i));
				if (sBuffer.substring(0, 2) == '%u') {
					msgEncoded += '|' + sBuffer.substring(2, sBuffer.length);
				} else {
					msgEncoded += sBuffer;
				}
			} else {
				msgEncoded += msg.charAt(i);
			}
		}
		
		msgEncoded = msgEncoded.replace('|201C', '\'').replace('|201D', '\'').replace('|2018', '\'').replace('|2019', '\'').replace('`', '\'').replace('%B4', '\'').replace('|FF20', '').replace('|FE6B', '');
		msgEncoded = escape(msgEncoded);
		return msgEncoded;
	}
}

class BotAPI {
	constructor() {
		this._sessionID;
		this._XAI;
		this._ns;
		this.language;
		this._messages;
		this.init();
	}

	init() {
		this._sessionID = ''; // WXHO6WNNKC
		this._XAI = '';
		this._ns = 1;
		this.language = 'en';
		this._messages = [];
	}

	postMessage(message) {
		return new Promise((resolve, reject) => {
			this._messages.push(message);

			let icognocheck = '';
			let xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			// 88.202.181.104:443
			let url = 'https://www.' + 'c' + 'l' + 'ev' + 'er' + 'bot.com/' + 'webservice' + 'min?uc=UseOfficial' + 'C' + 'l' + 'e' + 'ver' + 'bot' + 'API&';
			
			if (this._sessionID)
				url.concat(`out=${!!this._messages[this._messages.length - 2] ? Cryptography.messageEncode(this._messages[this._messages.length - 2]) : ''}&in=${Cryptography.messageEncode(this._messages[this._messages.length - 1])}&bot=c&cbsid=${this._sessionID}&xai=${this._sessionID.substr(0, 3)},${this._XAI}&ns=${this._ns++}&al=&dl=${this.language}&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&`);
			
			xhr.open('POST', url); // t=32511&'); #TODO
			
			xhr.onload = e => {
				console.log(e.target.responseText);
				const response = e.target.responseText.split('\r');
				this._messages.push(response[0]);
				this._sessionID = response[1];
				this._XAI = response[2];
				resolve(response[0]);
			};
		
			let stimulus = `stimulus=${[...this._messages].reverse().map((msg, index) => `${index ? `vText${index+1}=` : ''}${Cryptography.messageEncode(msg)}`).join('&')}&cb_settings_language=${this.language}&cb_settings_scripting=no&sessionid=${this._sessionID}&islearning=1&icognoid=wsf`;
			icognocheck = Cryptography.md5(stimulus.substring(7, 33));
			
			console.log(stimulus);
			xhr.send(stimulus + '&icognocheck=' + icognocheck);
		})
	}
}

class Bot {
	constructor(name) {
		this._name = name;

		// estes 2 arrays não precisariam ser arrays, apenas string. Estão sendo mantidos como array para facilitar caso futuramente seja alterado o comportamento do bot
		this._messagesToBeRead = [];
		this._messagesToBeSent = [];
		this._api = new BotAPI();
	}

	get name() {
		return this._name;
	}

	set name(value) {
		return this._name = value;
	}

	addMessageToBeRead(msg) {
		return this._messagesToBeRead.push(msg);
	}
	
	addMessageToBeSent(msg) {
		this._sent = false;
		return this._messagesToBeSent.push('```[' + this.name + ']``` ' + msg);
	}

	clearMessagesToBeSent() {
		this._messagesToBeSent.length = 0;
	}

	clearMessagesToBeRead() {
		this._messagesToBeRead.length = 0;
	}

	reply() {
		return new Promise((resolve, reject) => {
			console.log('Bot.reply()');
			console.log(this.name + '_messagesToBeRead', this._messagesToBeRead);
			if (!this._messagesToBeRead.length) {
				resolve();
				return;
			}

			// pega somente a última mensagem
			this._api.postMessage(this._messagesToBeRead[this._messagesToBeRead.length - 1])
				.then(answer => {
					this.addMessageToBeSent(answer);
					this._messagesToBeRead.length = 0;
					resolve();
				});
		})
	}

	getAnswer() {
		let answers = [...this._messagesToBeSent];
		this._messagesToBeSent.length = 0;
		return (answers.length ? answers[answers.length - 1] : '');
	}
}

class Chat {
	constructor(id) {
		this._id = id;
		this._messages = [];
		this._messagesToBeRead = [];
		this._messagesToBeSent = [];
		this._bots = new Map();
	}
	
	bots() {
		return this._bots;
	}

	// #TODO talvez não precise mais, agora que os bots estão expostos
	addBot(bot) {
		this._bots.set(bot.name, bot);
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get messages() {
		return [...this._messages];
	}

	addMessageToBeRead(message) {
		if (message) {
			this._messagesToBeRead.push(message);
			return this._messages.push(message);
		}
	}

	addMessageToBeSent(message) {
		if (message) {
			this._messagesToBeSent.push(message);
			return this._messages.push(message);
		}
	}

	clearMessagesToBeRead() {
		this._messagesToBeRead.length = 0;
	}

	popMessagesToBeSent() {
		const messagesToBeSent = [...this._messagesToBeSent];
		this._messagesToBeSent.length = 0;
		return messagesToBeSent;
	}

	reply() {
		return new Promise(async (resolve, reject) => {
			for (let bot of this._bots.values()) {
				this._messagesToBeRead.forEach(receivedMessage => {
					let receivedMessageTreated = '';
					if (new RegExp(`\\b${bot.name}\\b`, 'i').test(receivedMessage)) {
						// #TODO implementar [bot:stop]
						if (receivedMessage.includes('[```' + bot.name + '```:reset]'))
							return bot.clearMessagesToBeRead();
						else if (receivedMessage.includes('[```' + bot.name + '```:listening]'))
							return;
						receivedMessageTreated = receivedMessage.replace(new RegExp(`[^a-z|\\d|\\u00E0-\\u00FC]*\\b${bot.name}\\b[^a-z|\\d|\\u00E0-\\u00FC]*`, 'i'), '');
						if (/[a-z|\d]\s*$/i.test(receivedMessageTreated))
							receivedMessageTreated += '.';
					}

					if (receivedMessageTreated.length > 1)
						bot.addMessageToBeRead(receivedMessageTreated);
				});
			}

			this.clearMessagesToBeRead();			

			await Promise.all([...this._bots.values()].map(bot => bot.reply()));

			this._bots.forEach(bot => {
				bot.clearMessagesToBeRead();
				this.addMessageToBeSent(bot.getAnswer());
			});

			resolve();
		})
	}
}

class ChatMap extends Map {
	constructor(...chats) {
		super(chats.map(chat => [chat.id, chat]));
	}
}

class ChatController {
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

// #TODO Talvez fazer binding em alguns casos

class ChatMapController extends Map {
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
		});
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
