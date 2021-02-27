// https://github.com/JamesBrill/react-speech-recognition#basic-example
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import React, { useEffect, useState } from 'react';
import wordsToNumbers from 'words-to-numbers';


//https://tutorialzine.com/2017/08/converting-from-speech-to-text-with-javascript
const SpeechToTextComponent = (props) => {
    const [message, setMessage] = useState('');
    const [input, setInput] = useState( document.getElementById(`text-input_${0}`))
    const commands = [
        {
            command: 'reset',
            callback: () => resetTranscript()
        },
        {
            command: 'select caption *',
            callback: (number) => {

               // setInput(document.getElementById(`text-input_${parseInt(wordsToNumbers(number))}`));
                props.selectCaption(parseInt(wordsToNumbers(number)));
            }
        },
        {
            command: 'select option *',
            callback: (number) => {

                //setInput(document.getElementById(`text-input_${parseInt(wordsToNumbers(number))}`));
                //if (input !== null) {
                  //  input.focus();
                    //input.select();
                //}
                props.selectCaption(parseInt(wordsToNumbers(number)));

            }
        },
        {
            command: 'next template',
            callback: () => {

                const nextButton = document.getElementById('next-button');
                nextButton.click();

            }
        },
        {
            command: 'previous template',
            callback: () => {

                const prevButton = document.getElementById('prev-button');
                prevButton.click();

            }
        },
        {
            command: 'insert *',
            callback: (text) => {
                //if (input !== undefined && input !== null )
              /*  if (input !== null) {
                    input.focus();
                    input.select();
                    input.value = text
                }*/
                props.setCaption(text);

            }
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
        <div>
            <div>
                <span>
                    Listening:
              {' '}
                    {listening ? 'on' : 'off'}
                </span>
                <div>
                    <button className="button" onClick={resetTranscript}>Reset</button>
                    <button className="button" onClick={listenContinuously}>Listen</button>
                    <button className="button" onClick={SpeechRecognition.stopListening}>Stop</button>
                </div>
            </div>
            <div>
                {message}
            </div>
            <div>
                <span>{transcript}</span>
            </div>
        </div>
    );
};

export default SpeechToTextComponent;