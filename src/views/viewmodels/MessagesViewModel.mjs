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

	has(msgViewModel) {
		return this.some(mvm => mvm.equals(msgViewModel));
	}

	remove(msgsViewModel) {
		let mvmsToRemove = [...msgsViewModel];
		return this.filter(msgViewModel => {
			const index = mvmsToRemove.findIndex(mvmToRemove => msgViewModel.equals(mvmToRemove));
			if (index > -1) mvmsToRemove.splice(index, 1);
			return (index == -1);
		});
	}
}