// import {MessageView} from './MessageView';

/*export*/ class MessagesView extends Array {
	constructor(...args) {
		super(...args);
		this.lastChecked;
	}

	push(messageView) {
		if (messageView.sender && messageView.text) {
			if (messageView.datetime > this.lastChecked)
				this.lastChecked = messageView.datetime;
			return super.push(messageView);
		}
		return false;
	}
}