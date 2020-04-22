export class MessagesViewModel extends Array {
	constructor(...msgViewModels) {
		super();
		this.lastChecked = 0;
		msgViewModels.forEach(msgViewModel => this.push(msgViewModel));
	}

	push(msgViewModel) {
		if (msgViewModel.author && msgViewModel.text) {
			if (msgViewModel.date > this.lastChecked)
				this.lastChecked = msgViewModel.date;
			return super.push(msgViewModel);
		}
		return false;
	}

	remove(msgsViewModel) {
		let result = [];
		let _messagesViewModel = [...msgsViewModel];
		this.forEach(thisMsgViewModel => {
			let foundIndex = _messagesViewModel.findIndex(msgViewModel => (thisMsgViewModel.author === msgViewModel.author) && (thisMsgViewModel.text === msgViewModel.text) && (Math.abs(thisMsgViewModel.date - msgViewModel.date) <= 60000));
			if (foundIndex > -1)
				_messagesViewModel.splice(foundIndex, 1);
			else
				result.push(thisMsgViewModel);
		});
		return result;
	}
}