import Store from '../../../../redux/store';
import { getFormat, getImageDimensions, getVideoDimensions } from '../../../../utils/ImageUtils';
const React = require('react')

// This component enables the user to upload images from the local s
class IfUploadComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filesArray: null,
            isFetching: false,
            fileData: null,
            accessToken: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    /**
     * 
     * @param {event} event 
     * Handles file upload and stores the file(s) into an array
     * 
     */
    handleChange(event) {
        this.setState({
            isFetching: true,
        })
        var files = event.target.files;
        let dimensions = []
        for (var i = 0; i < files.length; ++i) {
            const file = files[i];
            let dim;
            const formatType = getFormat(file.name);
            console.log(formatType)
            if (formatType === 'image' ||  formatType === 'gif') {
                dim = getImageDimensions(file);
            } else if (formatType === 'video') {
                dim = getVideoDimensions(file);
            } else {
                return
            }
            dimensions.push(dim);


        }

        Promise.all(dimensions).then((dims) => {
            let data = []
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                const formatType = getFormat(file.name);
                try {
                    this.uploadImagesToServer(file, dims[i], formatType);
                } catch (e) {
                    console.log(e)
                }
                data.push({
                    id: 0,
                    name: file.name,
                    box_count: 2,
                    width: dims[i].width, //Todo: User width and height from image
                    height: dims[i].height,
                    url: URL.createObjectURL(file),
                    formatType: formatType,
                });
            }
            this.setState({
                isFetching: false,
            }, () => this.props.setImagesArray(data, this.state.isFetching))
        }).catch(function (errdims) {
            console.log(errdims)
        })
        console.log("Upload Images is done!")
    }


    /**
     * 
     * @param {*} file
     * Upload uploaded image to server
     *  
     */
    uploadImagesToServer(file, dim, formatType) {
        const reader = new FileReader();

        reader.addEventListener("load", () => {

            var object2Publish = {};
            //object2Publish.accessToken = this.state.accessToken;
            object2Publish.title = file.name;
            object2Publish.base64 = reader.result;
            object2Publish.width = dim.width;
            object2Publish.height = dim.height;
            object2Publish.fileType = formatType;

            // convert image file to base64 string
            console.log(reader.result)
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.state.accessToken,
                },
                body: JSON.stringify(object2Publish)
            };
            //   /memes/uploadtemplate
            fetch(this.props.URL, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data);
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }

                })
                .catch(error => {
                    this.setState({
                        errorMessage: error.toString()
                    });
                    console.error('There was an error!', error);
                });

        }, false);

        reader.readAsDataURL(file);
    }


    render() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

        return (
            <div>
                <div id="upload-button" className="button" >
                    <label htmlFor="file-upload">
                        Upload Images / Videos / Gifs</label></div>
                <input type="file" id="file-upload" onChange={this.handleChange} multiple />
                <div className="sample-image-container">
                    <img src={this.state.filesArray} id="previewImage" alt="" className="sample-images" />
                </div>
            </div>
        );
    }
}

export default IfUploadComponent