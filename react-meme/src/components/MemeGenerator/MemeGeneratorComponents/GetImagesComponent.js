import IfServerComponent from './GetImagesComponents/IfServerComponent'
import IfUrlComponent from './GetImagesComponents/IfUrlComponent'
import IfUploadComponent from './GetImagesComponents/IfUploadComponent'
import IfCameraComponent from './GetImagesComponents/IfCameraComponent'
import BlankComponent from './GetImagesComponents/BlankComponent'
import Meme from '../Meme';
import TextBoxes from '../TextBoxes';

const React = require('react')
require('./GetImagesComponent.css');

const initializeText = {
    textID: 0,
    text: '',
    textPosX: 100,
    textPosY: 100,
    fontColor: '#ffffff',
    fontFamily: 'Impact',
    fontSize: '50',
    outlineWidth: '3',
    outlineColor: '#000000',
}

/**
 * 
 * @param {url} url 
 * @param {*} timeoutT 
 * function to check whether an image is able to be loaded
 * 
 */
function testImage(url, timeoutT) {
    return new Promise(function (resolve, reject) {
        var timeout = timeoutT || 5000;
        var timer, img = new Image();
        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject("error");
        };
        img.onload = function () {
            clearTimeout(timer);
            resolve("success");
        };
        timer = setTimeout(function () {
            // reset .src to invalid URL so it stops previous
            // loading, but doens't trigger new load
            img.src = "//!!!!/noexist.jpg";
            reject("timeout");
        }, timeout);
        img.src = url;
    });
}


class GetImagesComponents extends React.Component {
    constructor(props) {
        super(props)
    }

    /**
     * 
     * @param {Array} data An array with image templates to use as meme templates
     * @param {boolean} isFetching A boolean to indicate whether the images have been fetched
     * Basically passes a new array which consists of Meme Objects
     * 
     */
    setImagesArray = (data, isFetching) => {

        console.log(data)
        if (!isFetching) {
            // Creates an array of Meme Objects fetched from server
            let memeArray = [];
            for (var i = 0; i < data.length; i++) {
                let tmpInputBoxes = [];
                for (var b = 0; b < data[i].box_count; b++) {
                    tmpInputBoxes.push(new TextBoxes(
                        b,
                        initializeText.text,
                        initializeText.textPosX,
                        b * initializeText.textPosY + 50,
                        initializeText.fontColor,
                        initializeText.fontFamily,
                        initializeText.fontSize,
                        initializeText.outlineWidth,
                        initializeText.outlineColor)
                    );
                }

                var tmp = new Meme(data[i].url, data[i].id, data[i].width, data[i].height, data[i].name, data[i].box_count, tmpInputBoxes);
                memeArray.push(tmp)
            }
            this.props.setImagesArray(memeArray)
            document.getElementById("upload-image-close").click();
        }
    }

    render() {
        return (
        <div>
            <a className="button" href="#upload-image">Open Image Template</a>
            <div id="upload-image" class="modal-window">
                <div>
                    <a href="#" title="Close" id="upload-image-close" class="modal-close">Close</a>
                    <div className="get-images-container">
                        <BlankComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                        <IfCameraComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                        <IfServerComponent setImagesArray={this.setImagesArray} URL={this.props.URL} getImagesButtonName={"ImgFlip"} />
                        <IfUploadComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                        <IfUrlComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GetImagesComponents