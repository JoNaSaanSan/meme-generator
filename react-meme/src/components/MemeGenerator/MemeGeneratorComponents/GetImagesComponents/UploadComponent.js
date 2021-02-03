const React = require('react')

// This component enables the user to upload images from the local s
class UploadComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null,
            isFetching: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            isFetching: true
        })
        var files = event.target.files;
        // Creates an array of Meme Objects upload by user
        let data = []
        let urlArray = [];
        for (var i = 0; i < files.length; i++) {
            data.push({
                id: i,
                name: event.target.files[i].name,
                box_count: 2,
                width: 400,
                height: 400,
                url: URL.createObjectURL(event.target.files[i]),
            });
                urlArray.push(URL.createObjectURL(event.target.files[i]))
        }
        console.log(data)
        this.setState({
            file: urlArray,
            isFetching: false
        })
        this.props.setImagesArray(data, this.state.isFetching);
        console.log("Upload Images is done!")
    }
    render() {

        return (
            <div id="upload-button" className="button" >
                <label for="file-upload">
                    Upload Image</label>
                <input type="file" id="file-upload" onChange={this.handleChange} />
                <div className="sample-image-container">
                    <img src={this.state.file} className="sample-images" />
                </div>

            </div>
        );
    }
}

export default UploadComponent