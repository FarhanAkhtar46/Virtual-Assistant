const { ComponentDialog, WaterfallDialog, WaterfallStepContext } = require('botbuilder-dialogs');
const speechSdk = require('@microsoft/cognitiveservices-speech-sdk');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class MainDialog extends ComponentDialog {
    constructor(userState, conversationState) {
        super(MAIN_DIALOG);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {
        const speechConfig = speechSdk.SpeechConfig.fromSubscription('YourSubscriptionKey', 'YourServiceRegion');
        const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();

        const recognizer = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);
        
        return new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(async result => {
                console.log(`Recognized: ${result.text}`);
                if (result.text.includes('support')) {
                    await stepContext.context.sendActivity('You have reached technical support. How can I assist you?');
                } else if (result.text.includes('sales')) {
                    await stepContext.context.sendActivity('You have reached sales. How can I help you with our products?');
                } else {
                    await stepContext.context.sendActivity('Sorry, I did not understand that. Please say "support" or "sales".');
                }
                resolve(stepContext.next());
            }, err => {
                console.trace('Error recognizing speech: ', err);
                stepContext.context.sendActivity('Sorry, there was an error processing your request. Please try again.');
                resolve(stepContext.next());
            });
        });
    }

    async finalStep(stepContext) {
        return stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
