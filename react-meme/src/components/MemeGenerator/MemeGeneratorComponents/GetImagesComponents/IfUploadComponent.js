import Store from '../../../../redux/store';
import { getImageDimensions } from '../../../../utils/imageServerHandling';
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
        var dimensions = [];
        for (var i = 0; i < files.length; ++i) {
            const file = files[i];
            if (!file.type.match('image'))
                continue;


            dimensions.push(getImageDimensions(file));

            try {
                this.uploadImagesToServer(file);
            } catch (e) {
                console.log(e)
            }
        }

        Promise.all(dimensions).then((dims) => {
            let data = []
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                data.push({
                    id: i,
                    name: file.name,
                    box_count: 2,
                    width: dims[i].width, //Todo: User width and height from image
                    height: dims[i].height,
                    url: URL.createObjectURL(file),
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
    uploadImagesToServer(file) {
        console.log(file)
        const reader = new FileReader();

        reader.addEventListener("load", () => {

            var object2Publish = {};
            //object2Publish.accessToken = this.state.accessToken;
            object2Publish.title = file.name
            object2Publish.base_64 = reader.result


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
                        Upload Images</label></div>
                <input type="file" id="file-upload" onChange={this.handleChange} multiple />
                <div className="sample-image-container">
                    <img src={this.state.filesArray} id="previewImage" alt="" className="sample-images" />
                </div>
            </div>
        );
    }
}

export default IfUploadComponent