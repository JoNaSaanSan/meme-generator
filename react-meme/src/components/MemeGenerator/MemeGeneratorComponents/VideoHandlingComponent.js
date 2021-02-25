import { b64toBlob } from '../../../utils/ImageUtils';
import GIFEncoder from 'gif-encoder-2'


const React = require('react');
require('./VideoHandlingComponent.css');

class VideoHandlingComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            videoDuration: 0,
            currentTime: 0,
            recordingState: 'Not recording',
            videoBlobUrl: null,
            gifBlobUrl: null,
        }
    }



    componentDidUpdate(prevProps, prevState) {
    }

    /**
     * Record Gif using an encorder
     */
    recordGif() {
        const canvas = document.createElement("canvas");
        canvas.width = this.props.canvasWidth;
        canvas.height = this.props.canvasHeight
        const context = canvas.getContext("2d");

        const canvasBackground = document.getElementById("canvas-background");
        const canvasImages = document.getElementById("canvas-images");
        const canvasDraw = document.getElementById("canvas-draw");
        const canvasText = document.getElementById("canvas-text");

        var inputVideo = document.getElementById('video-input');

        let draw = () => {
            if (this.state.recordingState === 'Not recording') {
                gifStop();
                clearInterval(interval);
            }
            context.drawImage(canvasBackground, 0, 0);
            context.drawImage(canvasImages, 0, 0);
            context.drawImage(canvasDraw, 0, 0);
            context.drawImage(canvasText, 0, 0);
            this.setState({
                currentTime: Math.round(inputVideo.currentTime * 100) / 100,
            })
            encoder.addFrame(context)
        }



        const encoder = new GIFEncoder(this.props.canvasWidth, this.props.canvasHeight, 'octree', true, 500)
        encoder.start()
        inputVideo.play()
        var interval = setInterval(draw, 10);

        var gifStop = () => {
            encoder.finish()
            const buffer = encoder.out.getData()
            const blob = new Blob([buffer], { 'type': 'image/gif' });
            const url = URL.createObjectURL(blob);
            this.setState({
                gifBlobUrl: url,
            })
            const img = document.getElementById('gifimg');
            img.width = this.props.canvasWidth;
            img.height = this.props.canvasHeight;
            img.src = url;
        }

        var duration = (this.state.duration * 1000) || inputVideo.duration * 1000 || 5000;
        if (duration > 15000) {
            duration = 15000;
        }


        if (this.state.recordingState === 'Recording GIF') {
            setTimeout(function () {
                gifStop();
                clearInterval(interval);
            }, duration);

            this.props.inputBoxes.map((el, i) => {
                this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: false } });
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, this.props.inputBoxes[i].start * 1000);
                }).then(() => {
                    this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: true } });

                    return new Promise((resolve, reject) => {
                        if (this.props.inputBoxes[i].end > this.props.inputBoxes[i].start) {
                            setTimeout(resolve, (this.props.inputBoxes[i].end - this.props.inputBoxes[i].start) * 1000);
                        }
                    }).then(() => {
                        if (this.props.inputBoxes[i].end > 0) {
                            this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: false } });
                        }
                    });
                });
            })
        }
    }




    /**
     * Records Video 
     */
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
        var videoStream = canvas.captureStream(30);
        var mediaRecorder = new MediaRecorder(videoStream);
        var inputVideo = document.getElementById('video-input');
        var outputVideo = document.getElementById('video-output');
        var chunks = [];

        outputVideo.src = null;

        let draw = () => {
            if (this.state.recordingState === 'Not recording')  {
                clearInterval(interval);
                try {
                mediaRecorder.stop();
                } catch (e) {
                    console.log(e)
                }
            }
            context.drawImage(canvasBackground, 0, 0);
            context.drawImage(canvasImages, 0, 0);
            context.drawImage(canvasDraw, 0, 0);
            context.drawImage(canvasText, 0, 0);
            this.setState({
                currentTime: Math.round(inputVideo.currentTime * 100) / 100,
            })
        }

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };


        mediaRecorder.onstop = (e) => {
            var blob = new Blob(chunks, { 'type': 'video/mp4' });
            this.props.setDynamicBlob(blob)
            chunks = [];
            var videoURL = URL.createObjectURL(blob);
            if (outputVideo !== null) {
                outputVideo.src = videoURL;
                this.setState({
                    videoBlobUrl: videoURL,
                })
            }
        };
        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };

        if (this.state.recordingState === 'Recording Video') {
            mediaRecorder.start();
            inputVideo.play()
            var interval = setInterval(draw, 30);

            var duration = (this.state.duration * 1000) || inputVideo.duration * 1000 || 5000;
            setTimeout(() => {
                if (this.state.recordingState === 'Recording Video') {
                    mediaRecorder.stop();
                    clearInterval(interval);
                }
            }, duration);
            this.props.inputBoxes.map((el, i) => {
                this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: false } });
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, this.props.inputBoxes[i].start * 1000);
                }).then(() => {
                    this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: true } });

                    return new Promise((resolve, reject) => {
                        if (this.props.inputBoxes[i].end > this.props.inputBoxes[i].start) {
                            setTimeout(resolve, (this.props.inputBoxes[i].end - this.props.inputBoxes[i].start) * 1000);
                        }
                    }).then(() => {
                        if (this.props.inputBoxes[i].end > 0) {
                            this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: false } });
                        }
                    });
                });
            })
        }
    }

    handleTextChange(i, event) {
        this.props.handleInputBoxesChange(i, event);
    }

    handleChange(event) {
        if (event.target.name === 'recordVideo') {
            this.setState({
                recordingState: 'Recording Video',
            }, () => this.recordVideo())
        } else if (event.target.name === 'stop') {
            this.setState({
                recordingState: 'Not recording',
            })
        } else if (event.target.name === 'recordGIF') {
            this.setState({
                recordingState: 'Recording GIF'
            }, () => this.recordGif())
        } else if (event.target.name === 'duration') {
            this.setState({
                duration: event.target.value,
            })
        } else if (event.target.name === 'renderVideo') {
            this.downloadVideo();
        } else if (event.target.name === 'renderGIF') {
            this.downloadGif();
        }
    }

    textVideoUI() {
        if (this.props.inputBoxes !== null && this.props.inputBoxes !== undefined) {

            return this.props.inputBoxes.map((el, i) =>
                <div key={i} className="timeline-item">
                    <div> Textbox: {el.text}
                        <div>
                            <input type="text" placeholder="0" name="start" id={'start-input_' + i} value={this.props.inputBoxes[i].start} className="input-box" maxLength="3" onChange={this.handleTextChange.bind(this, i)} />
                            <input type="text" placeholder="2" name="end" id={'end-input_' + i} value={this.props.inputBoxes[i].end} className="input-box" maxLength="3" onChange={this.handleTextChange.bind(this, i)} />
                        </div>
                    </div>
                </div>
            )
        }
    }

    downloadVideo() {
        const a = document.createElement("a");
        try {
            a.download = this.props.currentTemplate.name + '.mp4';
            a.href = this.state.videoBlobUrl;
            document.body.appendChild(a);
            a.click();
        }
        catch (e) {

        }
    }


    downloadGif() {
        const a = document.createElement("a");
        try {
            a.download = this.props.currentTemplate.name + '.gif';
            a.href = this.state.gifBlobUrl;
            document.body.appendChild(a);
            a.click();
        }
        catch (e) {

        }
    }


    render() {


        return <div className='video-view'>
            {this.state.recordingState}
            <div> <div> Time </div>
                {this.state.currentTime}</div>
            <button name="recordVideo" onClick={this.handleChange.bind(this)} id="record-button" className="button">Record Video</button>
            <button name="renderVideo" onClick={this.handleChange.bind(this)} id="render-button" className="button">Download Video</button>
            <button name="recordGIF" onClick={this.handleChange.bind(this)} id="record-button" className="button">Record GIF</button>
            <button name="renderGIF" onClick={this.handleChange.bind(this)} id="render-button" className="button">Download GIF</button>

            <button name="stop" onClick={this.handleChange.bind(this)} id="stop-button" className="button">Stop Record</button>

            <div> Duration in Seconds </div>
            <input type="text" placeholder="Leave empty for full video" name="duration" className="input-box" maxLength="3" value={this.state.duration} onChange={this.handleChange.bind(this)} />
            {this.textVideoUI()}

            {//(this.props.currentTemplate.formatType === 'video' || ) ?
                <div id="video-container">
                    <video id="video-input" controls="true" crossorigin="anonymous" autoPlay='true' />
                    <div> Video Output </div>
                    <video id="video-output" controls="true" crossorigin="anonymous" />
                    <div> GIF Output </div>
                    <img id='gifimg' height='300' width='500'></img>
                </div>

                // : <div></div>
            }



        </div>

    }

}

export default VideoHandlingComponent;