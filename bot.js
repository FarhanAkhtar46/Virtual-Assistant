const { ActivityHandler } = require('botbuilder');
const speechSdk = require('@microsoft/cognitiveservices-speech-sdk');

class IVRBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[IVRBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[IVRBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[IVRBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async (context, next) => {
            await this.dialog.run(context, this.dialogState);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to our company. Please say "support" or "sales" to proceed.');
                }
            }
            await next();
        });
    }

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

module.exports.IVRBot = IVRBot;
