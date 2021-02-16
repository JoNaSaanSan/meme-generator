const React = require('react')

// This component enables the user to upload images from the local s
class IfUploadComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filesArray: null,
            isFetching: false,
            fileData: null,
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
            dimensions.push(new Promise((resolve, reject) => {
                var src = URL.createObjectURL(file);
                var img = new Image();
                img.onload = () => {
                    resolve({ width: img.width, height: img.height });
                    URL.revokeObjectURL(src);
                };
                img.src = src;
            }));
        }

        Promise.all(dimensions).then((dims) => {
            let data = []
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                data.push({
                    id: i,
                    name: 'URL',
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


    render() {

        return (
            <div>
                <div id="upload-button" className="button" >
                    <label htmlFor="file-upload">
                        Upload Image</label></div>
                <input type="file" id="file-upload" onChange={this.handleChange} multiple />
                <div className="sample-image-container">
                    <img src={this.state.filesArray} id="previewImage" alt="" className="sample-images" />
                </div>
            </div>
        );
    }
}

export default IfUploadComponent