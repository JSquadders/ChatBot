// import {MessageViewmodel} from './MessageViewmodel';

/*export*/ class MessagesViewmodel extends Array {
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

	last() {
		this[this.length - 1];
	}

	oldestToNewest() {
		return [...this];
	}

	newestToOldest() {
		return this.reverse();
	}
}