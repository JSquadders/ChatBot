export class Chat {
	
	constructor(title) {
		this._title = title;
		this._messages = []; // mensagens da mais recente para a mais antiga
		this._messagesToBeRead = []; // mensagens da mais recente para a mais antiga
		this._messagesToBeSent = [];
		this._bots = new Map();
		this._checked = false;
	}
	
	addBot(bot) {
		this._bots.set(bot.name, bot);
	}

	nBots() {
		return this._bots.size;
	}

	get checked() {
		return this._checked;
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	get messages() {
		return [...this._messages];
	}

	addMessageToBeRead(message) {
		this._messagesToBeRead.unshift(message);
		this._messages.unshift(message);
	}

	addMessageToBeSent(message) {
		this._messagesToBeSent.unshift(message);
		this._messages.unshift(message);
	}

	reply() {
		// #TODO mandar pro bot as mensagens tais quais serão enviadas à API
		// #TODO se bot receber mais de 1 mensagem de uma vez, concatená-las acrescentando ponto final se necessário
		// #TODO deverá haver um loop para checar mensagens direcionadas para cada bot participante da conversa
		
		// if (/\[bot:reset\]/.test(message)) {
		// 	msgBuffer = [];
		// } else
		
		// #TODO puxar nome do bot em vez de "BOT"
		// #TODO corrigir algoritmo
		if (/\bBOT\b/i.test(message) && !/\[bot:listening\]|\[bot:stop\]/.test(message)) {
			let msg = message.replace(/[^a-z|\d|\u00E0-\u00FC]*\bBOT\b[^a-z|\d|\u00E0-\u00FC]*/i, '');
			if (msg.length) {
				if (/[a-z|\d]\s*$/i.test(msg))
					msg += '.';
				bot.addMessage(msg);
				bot.reply(); // #TODO Promise. Ao retornar, chamar addMessageToBeSent()
			}
		}
	}
}