import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import React, { useEffect } from 'react';
import wordsToNumbers from 'words-to-numbers';
import { colourNameToHex } from './ImageUtils';


/**
 * 
 * @param {*} props 
 * This functional component uses the hooks and the react speech recognition library to handle voice commands and input
 * @see https://github.com/JamesBrill/react-speech-recognition#basic-example
 * 
 */
const SpeechToText = (props) => {
    //voice commands
    const commands = [
        {
            command: 'reset',
            callback: () => resetTranscript()
        },
        {
            command: 'next template',
            callback: () => {
                const nextButton = document.getElementById('next-button');
                nextButton.click();
            },
        },
        {
            command: 'previous template',
            callback: () => {
                const prevButton = document.getElementById('prev-button');
                prevButton.click();

            },
        },
        {
            command: 'select caption *',
            callback: (command, spokenPhrase, similarityRatio, object) => {
                console.log(command, spokenPhrase, similarityRatio, object)
                var n = spokenPhrase.split(" ")
                var number = n[n.length - 1];
                console.log(parseInt(wordsToNumbers(number)))
                console.log(number)
                try {
                    props.selectCaption(parseInt(wordsToNumbers(number)));
                } catch (e) {
                    console.log(e)
                }
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.6
        },
        {
            command: 'insert *',
            callback: (text) => {
                props.setCaption(text);
            },
        },
        {
            command: 'write *',
            callback: (text) => {
                props.setCaption(text);
            },
        },
        {
            command: 'move (to the) *',
            callback: (direction) => {
                props.setPosition(direction);
            },
        },
        {
            command: 'change font size *',
            callback: (size) => {
                console.log(size)
                console.log(parseInt(wordsToNumbers(size)))
                props.setFontSize(parseInt(wordsToNumbers(size)));
            },
        },
        {
            command: 'change font colour *',
            callback: (colour) => {
                props.setFontColour(colourNameToHex(colour));
            },
        },
        {
            command: 'change font style *',
            callback: (style) => {
                props.setFontStyle(style);
            },
        },
    ]
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (finalTranscript !== '') {
            console.log('Got final result:', finalTranscript);
        }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };


    return (
        <div id="speech-to-text-container">
            <div className="transcript">
                <span>{transcript}</span>
            </div>
            <div>
                    {listening ?
                    <button className="button" onClick={SpeechRecognition.stopListening}>Turn speech to text off</button>
                    : <button className="button" onClick={listenContinuously}>Turn speech to text on</button>}
                <button className="button" onClick={resetTranscript}>Reset</button>
            </div>
        </div>
    );
};

export default SpeechToText;