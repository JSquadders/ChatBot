## Porting the chatbot to a new chat
To add support to a new chat - such as Facebook Messenger -, all you have to do is to extend the [#####ChatViewBase#####](ChatViewBase) class and implement the 3 "abstract" methods (see below).

Then, to use the Chatbot in the new chat, you just have to instantiate your own extended `ChatView` in place of the base one.

### Methods to implement

#### getMessages()
Returns a [###MessagesViewModel###]() with all the messages, both read and unread.

#### hasNewMessage()
Returns `true` if there are any messages to be read; `false` otherwise.

Note that these are not necessarily messages that have been just received (which usually have some kind of alert or notification), but messages the bot hasn't checked out yet. When the View is created, all the messages that were already there are considered new because the bot hasn't read them yet.

#### postMessage(message)
Posts message to the conversation the View is assigned to.

Usually the message should also be added to `this._messagesViewModel` so that it's not considered new by [hasNewMessage](hasNewMessage), otherwise the bot would answer itself.

### Helper methods
The methods below can be used straight from the base class, without overriding.

#### popNewMessages()
Returns a `Promise` that resolves with a [#######MessagesViewModel#######]() containing all the new messages (according to the rule of #####hasNewMessage#####), and "marks" them as read.

#### querySelector[All](selector[, interval, fulfillmentCallback(timeElapsed, currentElement[s], previousElement[s]), rootElement])
These are async `querySelector` and `querySelectorAll` with custom behavior that return a Promise. The purpose of this is to ease the handling of the async nature of the DOM.

`fulfillmentCallback` is a function that is called every `interval` milliseconds with the result of a normal `querySelector[All](selector)`, which is also called repeatedly, right before every callback call. The Promise resolves when the callback returns a truthy value, which is also the value the Promise is resolved with. To resolve with `null`, the callback must return `true`. Yes, a little confusing.

`fulfillmentCallback` takes 3 arguments:
- `timeElapsed`: time elapsed (in milliseconds) since the `querySelector[All]` was first called;
- `currentElement[s]`: element(s) returned from the current execution of `querySelector[All](selector)`;
- `previousElement[s]`: element(s) returned from the previous execution of `querySelector[All](selector)`.

Because the `interval` starts counting from the moment the previous callback is *finished*, there's no risk of truncating calls to `fulfillmentCallback` even if the function is slow and the interval is short.