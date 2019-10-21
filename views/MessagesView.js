// import {MessageView} from './MessageView';

/*export*/ class MessagesView extends Array {
	constructor(...messageViews) {
		super();
		this.lastChecked = 0;
		messageViews.forEach(messageView => this.push(messageView));
	}

	push(messageView) {
		if (messageView.sender && messageView.text) {
			if (messageView.datetime > this.lastChecked)
				this.lastChecked = messageView.datetime;
			return super.push(messageView);
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