import {Chat} from './Chat';

let chatMapView = new ChatMapView();
chatMapView.set(ChatMapView.getAllChatsTitles().map(chatTitle => [chatTitle, new chatView(chatTitle)]));

let chatMap = new ChatMap();

// #TODO forEach retorna cada par do map, não cada item
chatMapView.forEach(chatView => chatMap.set([chatView.title, new Chat(title)]));

let chatMapController = new ChatMapController(chatMap, chatMapView)

let bot1 = new Bot('botName');
bot1.messageInterval = 5000;

// chatMapController['JSquad'].addBot(bot1);
// chatMapController['JSquad'].removeBot(bot1);