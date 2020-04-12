## Porting the chatbot to a new chat
To add support to a new chat - such as Facebook Messenger, Slack, among others -, all you have to do is to extend the [ChatView class](./src/views/ChatView.mjs) and implement the "abstract" methods described below.

Then, to use the Chatbot in the new chat, you just have to instantiate your own extended `ChatView` in place of the base one.

-----
### Methods to implement

1. #### _async_ getMessages()
Returns a [MessagesViewModel](./src/views/viewmodels/MessagesViewModel.mjs) with all the messages, both read and unread.

1. #### _async_ postMessage(message)
	Posts message to the conversation the View is attached to.

	Usually the message should also be added to `this._messagesViewModel` so that it's not considered new by [hasNewMessage](#hasNewMessage), otherwise the bot would answer itself.

1. #### _async_ switch()
	Returns a `Promise` that resolves with a [MessagesViewModel](./src/views/viewmodels/MessagesViewModel.mjs) containing all the new messages (according to [hasNewMessage](#hasNewMessage)), and marks them as read.
-----

### Helper methods
The methods below can be used straight from the base class, without overriding.

#### querySelector[All](selector, interval [, fulfillmentCallback(timeElapsed, currentElement[s], previousElement[s]), rootElement])

These are async `querySelector` and `querySelectorAll` with custom behavior that return a Promise. Their purpose is easing the handling of the async nature of the DOM.

`fulfillmentCallback` is a function that is called every `interval` milliseconds with the result of a normal `querySelector[All](selector)`. The Promise resolves when the callback returns a truthy value, which is also the value the Promise is resolved with. To resolve with `null`, the callback must return `true`. Yes, a little confusing.

`fulfillmentCallback` takes 3 arguments:
- `timeElapsed`: time elapsed (in milliseconds) since `querySelector[All]` was first called;
- `currentElement[s]`: element(s) returned from the current execution of `querySelector[All](selector)`;
- `previousElement[s]`: element(s) returned from the previous execution of `querySelector[All](selector)`.

Because the `interval` starts counting from the moment the previous callback finishes executing, there's no risk of truncating calls to `fulfillmentCallback` even if the interval is shorter than the time the function takes to execute.

#### Example
The code below calls `document.querySelector` with the `._3dGYA` CSS selector every `1000`ms until the `title` of the returned element is _"load earlier messages…"_, with a timeout of `5000`ms to make sure it doesn't make an infinite loop.

```javascript
await this.querySelector('._3dGYA', 1000, (timeElapsed, currentElement) => {
	if (timeElapsed >= 5000)
		return true; // timeout reached. The querySelector function will return null
	else if (currentElement.title === 'load earlier messages…')
		return currentElement; // found desired element, which will be returned by the querySelector
	else
		return false; // unresolved. The querySelector will be called again after 1000ms
});
```