import IfServerComponent from './GetImagesComponents/IfServerComponent'
import IfUrlComponent from './GetImagesComponents/IfUrlComponent'
import IfUploadComponent from './GetImagesComponents/IfUploadComponent'
import IfCameraComponent from './GetImagesComponents/IfCameraComponent'
import Meme from '../Meme';

const React = require('react')

const initializeText = {
    textID: 0,
    text: '',
    textPosX: 100,
    textPosY: 100,
    fontColor: '#ffffff',
    fontFamily: 'Impact',
    fontSize: '50',
}

/**
 * 
 * @param {url} url 
 * @param {*} timeoutT 
 * function to check whether an image is able to be loaded
 * 
 */
function testImage(url, timeoutT) {
    return new Promise(function(resolve, reject) {
      var timeout = timeoutT || 5000;
      var timer, img = new Image();
      img.onerror = img.onabort = function() {
          clearTimeout(timer);
      	  reject("error");
      };
      img.onload = function() {
           clearTimeout(timer);
           resolve("success");
      };
      timer = setTimeout(function() {
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
        if (!isFetching) {
            // Creates an array of Meme Objects fetched from server
            let memeArray = [];
            for (var i = 0; i < data.length; i++) {
                let tmpInputBoxes = [];
                for (var b = 0; b < data[i].box_count; b++) {
                    tmpInputBoxes.push(Object.assign({}, initializeText, { textID: b, textPosY: b*initializeText.textPosY + 50 }));
                }
                var tmp = new Meme(data[i].url, data[i].id, data[i].width, data[i].height, data[i].name, data[i].box_count, tmpInputBoxes);
                memeArray.push(tmp)
            }
            this.props.setImagesArray(memeArray)
        }
    }

    render() {
        return (
            <div id="get-images-buttons-container">
                <IfUploadComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                <IfUrlComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                <IfCameraComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                <IfServerComponent setImagesArray={this.setImagesArray} URL={this.props.URL} getImagesButtonName={"ImgFlip"} />
            </div>
        );
    }
}

export default GetImagesComponents