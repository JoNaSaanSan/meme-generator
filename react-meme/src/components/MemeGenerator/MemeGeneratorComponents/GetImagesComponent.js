import IfServerComponent from './GetImagesComponents/IfServerComponent'
import IfUrlComponent from './GetImagesComponents/IfUrlComponent'
import IfUploadComponent from './GetImagesComponents/IfUploadComponent'
import IfCameraComponent from './GetImagesComponents/IfCameraComponent'
import IfDraftComponent from './GetImagesComponents/IfDraftComponent'
import IfTemplateComponent from './GetImagesComponents/IfTemplateComponent'
import IfScreenshotFromUrlComponent from './GetImagesComponents/IfScreenshotFromUrlComponent'
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
    isItalic: false,
    isBold: false,
    isVisible: true,
    start: 0,
    end: -1,
    duration: 1,
}

class GetImagesComponents extends React.Component {

    /**
     * 
     * @param {Array} data An array with image templates to use as meme templates
     * @param {boolean} isFetching A boolean to indicate whether the images have been fetched
     * Basically passes a new array which consists of Meme Objects
     * 
     */
    setImagesArray = (data, isFetching) => {
        if (!isFetching) {
            // Creates an array of Meme Objects fetched from server
            let memeArray = [];
            for (var i = 0; i < data.length; i++) {
                let tmpInputBoxes = [];
                let tmpDrawPaths = [];
                let tmpAdditionalImages = [];


                for (var b = 0; b < data[i].box_count; b++) {
                    if (data[i].inputBoxes === undefined) {
                        tmpInputBoxes.push(new TextBoxes(
                            b,
                            initializeText.text,
                            initializeText.textPosX,
                            b * initializeText.textPosY + 50,
                            initializeText.fontColor,
                            initializeText.fontFamily,
                            initializeText.fontSize,
                            initializeText.outlineWidth,
                            initializeText.outlineColor,
                            initializeText.isBold,
                            initializeText.isItalic,
                            initializeText.isVisible,
                            initializeText.start,
                            initializeText.end,
                            initializeText.duration,
                            )
                        );
                    } else {
                        tmpInputBoxes.push(data[i].inputBoxes[b])
                    }
                }


                if (data[i].drawPaths !== undefined) {
                    for (var p = 0; p < data[i].drawPaths.length; p++) {
                        tmpDrawPaths.push(data[i].drawPaths[p])
                    }
                }

                if (data[i].tmpAdditionalImages !== undefined) {
                    for (var a = 0; a < data[i].tmpAdditionalImages.length; a++) {
                        tmpAdditionalImages.push(data[i].tmpAdditionalImages[a])
                    }
                }
                var formatType = data[i].formatType || 'image';
                var stats = null;
                if(data[i].statistics !== null){
                    stats = data[i].statistics
                }
                var tmp = new Meme(data[i].url, data[i].id, data[i].width, data[i].height, data[i].name, data[i].box_count, tmpInputBoxes, tmpDrawPaths, tmpAdditionalImages, formatType, stats);
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
                <div id="upload-image" className="modal-window">
                    <div>
                        <a href="/#" title="Close" id="upload-image-close" className="modal-close">Close</a>
                        <div className="get-images-container">
                        <div> Saved Templates and Drafts </div>
                        <IfDraftComponent setImagesArray={this.setImagesArray} URL={this.props.URL + '/drafts/loaddrafts'} getImagesButtonName={"Load Drafts"} />
                        <IfTemplateComponent setImagesArray={this.setImagesArray} URL={this.props.URL + '/templates/loadtemplates'} getImagesButtonName={"Load Saved Templates"} />
                         
                        <div> Images </div>
                            <BlankComponent setImagesArray={this.setImagesArray} />
                            <IfCameraComponent setImagesArray={this.setImagesArray} />
                            <IfServerComponent setImagesArray={this.setImagesArray} URL={this.props.URL} getImagesButtonName={"ImgFlip"} />
                            <IfScreenshotFromUrlComponent setImagesArray={this.setImagesArray} URL={this.props.URL + '/templates/templatefromurl'} getImagesButtonName={"Get Screenshot from URL "} />
                           
                            <div> Images / Videos / Gifs</div>
                            <IfUrlComponent setImagesArray={this.setImagesArray} />
                            <IfUploadComponent setImagesArray={this.setImagesArray} URL={this.props.URL + '/templates/uploadtemplate'} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GetImagesComponents