export class MessagesViewmodel extends Array {
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