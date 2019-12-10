const alexa = require('ask-sdk-core')
const skillBuilder = alexa.SkillBuilders.custom()
const axios = require('axios')

async function getDataForMovieByTitle(title, key) {
    const apikey = process.env.IMDB_API_KEY
    console.log(apikey)
    const url = `http://www.omdbapi.com/?apikey=${apikey}&t=${title}`
    const response = await axios.get(url)
    return response.data[key]
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Movie plot'
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('speak utterances?')
            .withShouldEndSession(false)
            .getResponse()
    },
}


const MovieplotIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'movieplotIntent'

    },
    async handle(handlerInput) {
        const title = handlerInput.requestEnvelope.request.intent.slots.title.value
        const plot = await getDataForMovieByTitle(title, 'Plot')

        const answer = `The plot of ${title} is ${plot}`
        const reprompt = 'Would you like more info on another movie?'

        return handlerInput.responseBuilder
            .speak(answer + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
    },
}
const CancelAndStopIntentsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Thank you for using Movie Plot!')
            .withShouldEndSession(true)
            .getResponse()
    },
}
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I'm sorry, I didn't quite catch that. What movie plot would you like?")
            .reprompt("What movie story would you like?")
            .withShouldEndSession(false)
            .getResponse()
    },
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Movie plot can get you plot for a movie. You can say 'What is the plot of Frozen?' to me")
            .reprompt("Movie plot can get you plot for a movie. You can say 'What is the plot of Frozen? to me")
            .withShouldEndSession(false)
            .getResponse()
    },
};
const NoIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    },
    handle(handlerInput) {
        const speechText = 'Got you. Have a nice day. '

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse()
    },
};

const YesIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },
    handle(handlerInput) {
        const speechText = 'Okay. For which movie, would you like to know the story for? '
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse()
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'

    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;

        return responseBuilder
            .speak('Talk to you later!')
            .withShouldEndSession(true)
            .getResponse()
    },
}

const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak('Sorry I can\'t understand the command. Please say again.')
            .reprompt('Sorry I can\'t understand the command. Please say again.')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const skillBuilder = Alexa.skillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(MovieplotIntentHandler, FallbackIntentHandler, LaunchRequestHandler, CancelAndStopIntentsHandler, HelpIntentHandler, YesIntent, NoIntent, ExitHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda()