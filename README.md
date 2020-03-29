# [WIP] JSquadBot
Automation-based chatbot that is able to read and answer messages from a web-based chat such as Web WhatsApp.

It's not integrated directly with the chat API. Instead, it emulates the user in the browser and lets the webpage handle the requests. It was made like that not because it was the best approach, but for learning purposes.

Only WhatsApp is supported out of the box but, since it was developed in MVVM, it should be easy and quick to make it work anywhere else. Basically, you only need to [###implement 3 methods###]() that deal with the DOM.

Another advantage from the MVVM approach is that you can use only the functionality that matters to you. For instance, you can take only the View layer and use it for a purpose other than a chatbot.

## Usage
Inject all the code from `jsquadbot.min.mjs` into the webpage. There are several ways to do that. The most straightforward one is to just copy and paste it into the browser console. Another way is to use a browser extension that allows JS code to be injected automatically.

The injected code does nothing until it's actually called. Below there is an example of getting everything ready to deploy multiple bots to multiple conversations.

```javascript
let cv = new ChatView('Eliza');
/* This is the View class that deals with the DOM inside the given conversation.
 * It will also instantiate and make use of a ViewModels.
 * "Eliza" is the ID of your contact or chat group. Whether it's a name,
 * a number or whatever depends on how the View was implemented. The only
 * requirement is that it must be a unique string.
 * At this point you can already use ChatView methods
 */

let c = new ChatModel('Eliza');
/* This is the Model class that handles the given conversation.
 * The string ID 'Eliza' must be the same as passed to the ChatView above
 */

let cc = new ChatController('Eliza');
// 'Eliza' is the name of the contact or group that you want to attach to.

let cm = new ChatModelMap(c);
// Add our Chat to the Chat map, which handles all the conversations' ChatModels

let cvm = new ChatViewMap(cv);
// Add our Chat view to the Chat view map, which handles all the conversations Views

let cmc = new ChatControllerMap(cm, cvm);
/* Add both maps to the Controller map which will handle basically everything
 * by calling View, Model and Controller methods
 */

let b = new Bot('HAL');
/* Create a bot named "HAL".
 * At this point the bot isn't assigned to any conversation.
 */

await cmc.get('Eliza').addBot(b);
// Add the bot to the conversation with Eliza. It's still not active

cmc.listen();
/* This method starts everything.
 * Notice that the bot only answers messages that call its name.
 */
```