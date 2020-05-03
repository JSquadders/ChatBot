## Building

### `npm run build`
Creates a non-minified bundle at `src/jsquadbot.mjs`.

It has many useful `console.log` for debugging.

### `npm prepare`
Creates both a minified bundle at `src/jsquadbot.min.mjs` and a non-minified bundle as well.

It strips out all `console.log` in the minified bundle.

## Porting the chatbot to a new chat
To add support to a new chat - such as Facebook Messenger or Slack -, you have to extend the [ChatView](./src/views/ChatView.mjs) class, implement the "abstract" methods described below and then add your class to the [loader.mjs](./src/loader.mjs) so that it's included in the bundles.

Then, to use the Chatbot in the new chat, you just have to instantiate your own extended `ChatView` in place of the base one.

### Methods to implement

1. #### `async getMessages()`
	Returns a [MessagesViewModel](./src/views/viewmodels/MessagesViewModel.mjs) with all the messages, both read and unread.

1. #### `async postMessage(message)`
	Posts the message (string) to the conversation the View is attached to.

### Helper methods
The methods below can be used straight from the base class, without "overriding".

#### `querySelector[All](selector, interval [, fulfillmentCallback(timeElapsed, currentElement[s], previousElement[s]), rootElement])`

These are async `querySelector` and `querySelectorAll` with custom behavior that return a Promise. Their purpose is easing the handling of the async nature of the DOM.

`fulfillmentCallback` is a function that is called every `interval` milliseconds with the result of a normal `querySelector[All](selector)`. The Promise resolves when the callback returns a truthy value, which is also the value the Promise is resolved with. To resolve with `null`, the callback must return `true`. Yes, a little confusing.

`fulfillmentCallback` takes 3 arguments:
- `timeElapsed`: time elapsed (in milliseconds) since `querySelector[All]` was first called;
- `currentElement[s]`: element(s) returned from the current execution of `querySelector[All](selector)`;
- `previousElement[s]`: element(s) returned from the previous execution of `querySelector[All](selector)`.

Because the `interval` starts counting from the moment the previous callback finishes executing, there's no risk of truncating calls to `fulfillmentCallback` even if the interval is shorter than the time the function takes to execute.

#### Example
The code below calls `document.querySelector` with the `._3dGYA` CSS selector every `1000`ms until the `title` of the returned element is _"load earlier messages…"_, with a timeout of `5000`ms to make sure it doesn't result in an infinite loop.

```javascript
let result = await this.querySelector('._3dGYA', 1000, (timeElapsed, currentElement) => {
	if (timeElapsed >= 5000)
		return true; // timeout reached. "result" variable will be assigned null
	else if (currentElement.title === 'load earlier messages…')
		return currentElement; // found desired element, which will be assigned to the "result" variable
	else
		return false; // unresolved. No return yet. The querySelector will be called again after 1000ms
});
```