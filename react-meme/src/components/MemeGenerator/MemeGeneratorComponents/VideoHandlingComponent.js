import { b64toBlob } from '../../../utils/ImageUtils';
import { retrieveImage } from '../../../utils/CanvasUtils';

const React = require('react');
require('./VideoHandlingComponent.css');

class VideoHandlingComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }



    componentDidUpdate(prevProps, prevState) {


    }




    recordVideo() {

        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        canvas.width = this.props.canvasWidth;
        canvas.height = this.props.canvasHeight
        const context = canvas.getContext("2d");

        const canvasBackground = document.getElementById("canvas-background");
        const canvasImages = document.getElementById("canvas-images");
        const canvasDraw = document.getElementById("canvas-draw");
        const canvasText = document.getElementById("canvas-text");

        function draw() {

            context.drawImage(canvasBackground, 0, 0);
            context.drawImage(canvasImages, 0, 0);
            context.drawImage(canvasDraw, 0, 0);
            context.drawImage(canvasText, 0, 0);

        }
        var videoStream = canvas.captureStream(30);
        console.log(videoStream)
        var mediaRecorder = new MediaRecorder(videoStream);

        var chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };


        var video = document.getElementById('video-output');
        console.log(video)
        mediaRecorder.onstop = (e) => {
            var blob = new Blob(chunks, { 'type': 'video/mp4' });
            chunks = [];
            var videoURL = URL.createObjectURL(blob);
            if (video !== null)
                video.src = videoURL;
        };
        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };

        mediaRecorder.start();
        setInterval(draw, 30);
        setTimeout(function () { mediaRecorder.stop(); }, 15000);
    }



    handleChange(event) {
        if (event.target.name === 'record') {
            this.recordVideo();
        } else if (event.target.name === 'stop') {

        }
    }



    render() {


        return <div className='video-view'>
            <button name="record" onClick={this.handleChange.bind(this)} id="record-button" className="button">Record</button>
            <button name="stop" onClick={this.handleChange.bind(this)} id="stop-button" className="button">Stop Record</button>

            {(this.props.currentTemplate.formatType === 'video') ?
                <div id="video-container">
                    <video id="video" controls="true" crossorigin="anonymous" />
                    <video id="video-output" controls="true" crossorigin="anonymous" />
                </div>

                : <div></div>
            }



        </div>

    }

}

export default VideoHandlingComponent;