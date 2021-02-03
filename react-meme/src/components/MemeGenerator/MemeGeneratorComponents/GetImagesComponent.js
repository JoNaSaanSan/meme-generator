import IfServerComponent from './GetImagesComponents/IfServerComponent'
import UploadComponent from './GetImagesComponents/UploadComponent'
import Meme from '../Meme';

const React = require('react')

const initializeText = {
    textID: 0,
    text: '',
    textPosX: 100,
    textPosY: 100,
    fontColor: '#ffffff',
    fontFamily: '',
    fontSize: '50px',
}


class GetImagesComponents extends React.Component {
    constructor(props) {
        super(props)
    }

    setImagesArray = (data, isFetching) => {
        if (!isFetching) {
            // Creates an array of Meme Objects fetched from server
            let memeArray = [];
            for (var i = 0; i < data.length; i++) {
                console.log("Create Meme Objects")
                let tmpInputBoxes = [];
                for (var b = 0; b < data[i].box_count; b++) {
                    tmpInputBoxes.push(Object.assign({}, initializeText, { textID: b }));
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
                <UploadComponent setImagesArray={this.setImagesArray} URL={this.props.URL} />
                <IfServerComponent setImagesArray={this.setImagesArray} URL={this.props.URL} getImagesButtonName={"ImgFlip"} />
            </div>
        );
    }
}

export default GetImagesComponents