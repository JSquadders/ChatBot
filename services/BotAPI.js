import {Cryptography} from '../helpers/Cryptography';

export class BotAPI {
	
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

	sendMessage(message) {
		// #TODO retorna Promise. then(response) retorna a resposta
		
		this._messages.unshift(message);

		console.log('sendMessage()');
		console.log('_messages', this._messages);
		
		let icognocheck = '';
		xhr.open('POST', 'https://www.' + 'c' + 'l' + 'ev' + 'er' + 'bot.com/' + 'webservice' + 'min?uc=UseOfficial' + 'C' + 'l' + 'e' + 'ver' + 'bot' + 'API'
			+ `&out=${!!this._messages[1] ? Cryptography.messageEncode(this._messages[1]) : ''}&in=${Cryptography.messageEncode(this._messages[0])}&bot=c&cbsid=${this._sessionID}&xai=WXH,${this._XAI}&ns=${this._ns++}&al=&dl=${this.language}&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&`); // t=32511&'); #TODO
		
		xhr.onload = e => {
			const response = e.target.responseText.split('\r');
			this._sessionID = response[1];
			this._messages.unshift(response[0]);
			this._XAI = response[2];
		};
	
		let stimulus = `stimulus=${this._messages.map((msg, index) => `${index ? `vText${index+1}=` : ''}${Cryptography.messageEncode(msg)}`).join('&')}&cb_settings_language=${this.language}&cb_settings_scripting=no&sessionid=${this._sessionID}&islearning=1&icognoid=wsf`;
		icognocheck = Cryptography.md5(stimulus.substring(7, 33));
		
		console.log(stimulus);
		
		// #TODO teste
		return;
		
		xhr.send(stimulus + '&icognocheck=' + icognocheck);
	}

	getAnswer() {
	}
}