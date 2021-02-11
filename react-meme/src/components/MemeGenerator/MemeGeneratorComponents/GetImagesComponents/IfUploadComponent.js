const React = require('react')

// This component enables the user to upload images from the local s
class IfUploadComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filesArray: null,
            isFetching: false,
            isFetchingDone: false,
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
            isFetchingDone: false,
        })
        var files = event.target.files;



        var dimensions = [];
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            if (!file.type.match('image'))
            continue;
            dimensions.push(new Promise(function (resolve, reject) {
                var src = URL.createObjectURL(file);
                var img = new Image;
                img.onload = function () {
                    resolve({width: img.width, height: img.height});
                    URL.revokeObjectURL(src);
                };
                img.src = src;
            }));
        }

        var that = this;
        Promise.all(dimensions).then(function (dims) {
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
            that.setState({
                isFetching: false,
            }, () => that.props.setImagesArray(data, that.state.isFetching))
        }).catch(function (errdims) {
            console.log(errdims)
        })

        console.log("Upload Images is done!")
    }


    render() {

        return (
            <div>
                <div id="upload-button" className="button" >
                    <label for="file-upload">
                        Upload Image</label></div>
                <input type="file" id="file-upload" onChange={this.handleChange} multiple />
                <div className="sample-image-container">
                    <img src={this.state.filesArray} id="previewImage" className="sample-images" />
                </div>

            </div>
        );
    }
}

export default IfUploadComponent