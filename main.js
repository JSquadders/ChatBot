// import {Chat} from './models/Chat';
// import {ChatMap} from './models/ChatMap';
// import {ChatMapView} from './views/ChatMapView';
// import {ChatMapController} from './controllers/ChatMapController';

const chatMapView = new ChatMapView([...ChatMapView.getAllChatsTitles().map(chatTitle => new ChatView(chatTitle))]);
const chatMap = new ChatMap([...[...chatMapView].map(chatView => new Chat(chatView.title))]);
const chatMapController = new ChatMapController(chatMap, chatMapView);

chatMapController.get('JSquad').addBot(new Bot('botName'));