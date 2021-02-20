//https://justmarkup.com/articles/2020-05-19-text-to-speech/
export const textToSpeech = (message, voice, active) => {
    if(!active)
    return;
    window.speechSynthesis.onvoiceschanged = () => {
        console.log(voices)
        var voices = window.speechSynthesis.getVoices();
    }
    var utterance = new SpeechSynthesisUtterance();
    utterance.default = false;
    utterance.text = message;
    utterance.voice = voice;
    utterance.lang = 'en';
        window.speechSynthesis.speak(utterance);
};
