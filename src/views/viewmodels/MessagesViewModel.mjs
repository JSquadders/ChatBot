export class MessagesViewModel extends Array {
	constructor(...messageViewModels) {
		super();
		this.lastChecked = 0;
		messageViewModels.forEach(messageViewModel => this.push(messageViewModel));
	}

	push(messageViewModel) {
		if (messageViewModel.sender && messageViewModel.text) {
			if (messageViewModel.datetime > this.lastChecked)
				this.lastChecked = messageViewModel.datetime;
			return super.push(messageViewModel);
		}
		return false;
	}

	remove(messagesViewModel) {
		let result = [];
		let _messagesViewModel = [...messagesViewModel];
		this.forEach(thisMessageViewModel => {
			let foundIndex = _messagesViewModel.findIndex(messageViewModel => (thisMessageViewModel.sender == messageViewModel.sender) && (thisMessageViewModel.text == messageViewModel.text) && (Math.abs(thisMessageViewModel.datetime - messageViewModel.datetime) <= 60000));
			if (foundIndex > -1)
				_messagesViewModel.splice(foundIndex, 1);
			else
				result.push(thisMessageViewModel);
		});
		return result;
	}
}