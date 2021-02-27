//https://justmarkup.com/articles/2020-05-19-text-to-speech/
export const textToSpeech = (message, voice, active) => {
    if(!active)
    return;

    var utterance = new SpeechSynthesisUtterance();
    utterance.text = message;
    utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
};
