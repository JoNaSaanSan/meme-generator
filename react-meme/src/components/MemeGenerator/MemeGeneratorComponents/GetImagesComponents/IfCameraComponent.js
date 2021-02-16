import Camera from 'react-html5-camera-photo';
import { getImageDimensions } from '../../../../utils/imageServerHandling';
import 'react-html5-camera-photo/build/css/index.css';
const React = require('react')
// This component enables the user to upload images from the local s
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            isCamera: false,
            dataUri: '',
        }
        this.takePhoto = this.takePhoto.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.closeCamera = this.closeCamera.bind(this);
        this.handleTakePhoto = this.handleTakePhoto.bind(this);
    }

    takePhoto() {
        console.log(this.state.dataUri);
        this.setState({
            isPhoto: true,
        })

    }

    openCamera() {
        this.setState({
            isCamera: true,
            dataUri: '',
        })
    }


    closeCamera() {
        this.setState({
            isCamera: false,
            dataUri: '',
        })
    }

    /**
     * 
     * @param {*} uri 
     * Called whenever user takes a photo
     * 
     */
    handleTakePhoto(uri) {
        fetch(uri)
            .then(res => res.blob()).then(
                res => {

                    const dimensions = getImageDimensions(res);

                    dimensions.then((dims) => {
                        console.log(dimensions.width)
                        var tmpArr = [];
                        tmpArr.push({
                            id: 1,
                            name:'Camera',
                            box_count: 2,
                            width: dims.width,
                            height: dims.height,
                            url: URL.createObjectURL(res),
                        })
                        this.setState({
                            isFetching: false
                        }, () =>
                        this.props.setImagesArray(tmpArr, this.state.isFetching))
                    })
                })

        this.setState({
            dataUri: uri,
        })
    }


    render() {

        return (

            <div className="camera-container">
                {(this.state.dataUri || !this.state.isCamera) ?
                    <img alt="" src={this.state.dataUri} className="sample-images" />
                    : <Camera
                        onTakePhoto={(dataUri) => { this.handleTakePhoto(dataUri); }}
                    />
                }
                {(this.state.isCamera) ?
                    <button id="open-camera-button" className="button" onClick={this.closeCamera}> Close Camera </button> :
                    <button id="open-camera-button" className="button" onClick={this.openCamera}> Open Camera </button>}
            </div>
        );
    }
}

export default IfUrlComponent