# [WIP] JSquadBot

Automation-based chatbot that is able to read and answer messages from a web-based chat such as Web WhatsApp.

It's not integrated directly with the chat API. Instead, it emulates the user in the browser and lets the webpage handle the requests. It was made like that not because it was the best approach, but for learning purposes.

Only WhatsApp is supported out of the box but, since it was developed in MVVM, it should be easy to make it work anywhere else. Basically, you only need to [implement these 3 methods](./CONTRIBUTING.md#methods-to-implement), which handle the DOM.

Another advantage from the MVVM approach is that you can use only the functionality that matters to you. For instance, you can take only the View layer and use it for a purpose other than a chatbot.

## Usage
Inject all the code from `jsquadbot.min.mjs` into the webpage. There are several ways to do that. The most straightforward one is to just copy and paste it into the browser console. Another way is to use a browser extension that allows JS code to be injected automatically.

The injected code does nothing until it's actually called. See the example below.

### Example

```javascript
let cc = new ChatController('Eliza');
// "Eliza" is the name of the contact or group that you want to attach the bot to.

await cc.addBot('HAL');
// Add a bot named "HAL" to the conversation "Eliza".

await cc.update();
// Bot will read and answer messages that contain its name.
```