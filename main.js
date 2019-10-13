import {Chat} from './Chat';
import {ChatMapView} from './ChatMapView';
import {ChatMap} from './ChatMap';
import {ChatMapController} from './ChatMapController';

const chatMapView = new ChatMapView(ChatMapView.getAllChatsTitles().map(chatTitle => new chatView(chatTitle)));
const chatMap = new ChatMap([...chatMapView].map(chatView => new Chat(chatView.title)));
const chatMapController = new ChatMapController(chatMap, chatMapView);

let bot1 = new Bot('botName');
bot1.refreshInterval = 5000;

chatMapController['JSquad'].bots.set(bot1.name, bot1);