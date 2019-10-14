import {Chat} from './models/Chat';
import {ChatMapView} from './views/ChatMapView';
import {ChatMap} from './models/ChatMap';
import {ChatMapController} from './controllers/ChatMapController';

const chatMapView = new ChatMapView(ChatMapView.getAllChatsTitles().map(chatTitle => new chatView(chatTitle)));
const chatMap = new ChatMap([...chatMapView].map(chatView => new Chat(chatView.title)));
const chatMapController = new ChatMapController(chatMap, chatMapView);

chatMapController['JSquad'].addBot(new Bot('botName'));