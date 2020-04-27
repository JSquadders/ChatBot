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

	postMessage(msg) {
		return new Promise((resolve) => {
			msg = msg[0].toUpperCase() + msg.slice(1);
			this._messages.push(msg);

			const xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			// 88.202.181.104:443
			let url = 'https://www.' + 'clever' + 'bot.com/' + 'webservice' + 'min?uc=UseOfficial' + 'Clever' + 'bot' + 'API&';
			
			if (this._sessionID)
				url = url.concat(`out=${!!this._messages[this._messages.length - 2] ? Cryptography.messageEncode(this._messages[this._messages.length - 2]) : ''}&in=${Cryptography.messageEncode(this._messages[this._messages.length - 1])}&bot=c&cbsid=${this._sessionID}&xai=${this._sessionID.substr(0, 3)},${this._XAI}&ns=${this._ns++}&al=&dl=${this.language}&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&`);
			
			xhr.open('POST', url); // t=32511&'); @todo Missing argument
			
			xhr.onload = e => {
				console.log('Response: ', e.target.responseText);
				const response = e.target.responseText.split('\r');
				this._messages.push(response[0]);
				this._sessionID = response[1];
				this._XAI = response[2];
				resolve(response[0]);
			};
		
			const stimulus = `stimulus=${[...this._messages].reverse().map((msg, index) => `${index ? `vText${index+1}=` : ''}${Cryptography.messageEncode(msg)}`).join('&')}&cb_settings_language=${this.language}&cb_settings_scripting=no&sessionid=${this._sessionID}&islearning=1&icognoid=wsf`;
			const icognocheck = Cryptography.md5(stimulus.substring(7, 33));
			
			console.log('Payload: ', stimulus);
			xhr.send(stimulus + '&icognocheck=' + icognocheck);
		});
	}
}