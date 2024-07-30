const restify = require('restify');
const { BotFrameworkAdapter, MemoryStorage, UserState, ConversationState } = require('botbuilder');
const { IVRBot } = require('./bot');
const { MainDialog } = require('./dialogs/mainDialog');

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});

// Create adapter.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Define state store for your bot.
const memoryStorage = new MemoryStorage();
const userState = new UserState(memoryStorage);
const conversationState = new ConversationState(memoryStorage);

// Create the main dialog.
const dialog = new MainDialog(userState, conversationState);

// Create the bot.
const bot = new IVRBot(conversationState, userState, dialog);

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
