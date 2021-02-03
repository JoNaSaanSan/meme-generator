const React = require('react')

class UploadComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })        
        this.props.uploadedImage(event.target.files[0]);
    }
    render() {

        return (
            <div id="upload-button" className="button" > 
                <label for="file-upload">
                 Upload Image</label>
                <input type="file" id="file-upload" onChange={this.handleChange}/>
                <div className="sample-image-container">
                    <img src={this.state.file} className="sample-images"/>  
                </div>
              
            </div>
        );
    }
}

export default UploadComponent