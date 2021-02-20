import { getFormat, getImageDimensions, getVideoDimensions } from '../../../../utils/ImageUtils';
const React = require('react')
// This component enables the user to upload images from the local device
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isFetching: false,
            inputUrl: '',
        }

        this.submitUrl = this.submitUrl.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
    }

    /**
     * 
     * @param {event} event 
     * handles URL input change
     * 
     */
    updateUrl(event) {
        try {
            this.setState({
                inputUrl: event.target.value,
                isFetching: true
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * Creates an image object and pushes that object to an array
     */
    submitUrl() {

        console.log(this.state.inputUrl)
        // console.log( URL.createObjectURL(this.state.inputUrl))
        const formatType = getFormat(this.state.inputUrl);
        let dimension = {}
        if (formatType === 'image' || formatType === 'gif') {
            dimension = getImageDimensions(this.state.inputUrl);
        } else if (formatType === 'video') {
            dimension = getVideoDimensions(this.state.inputUrl);;
        } else {
            return
        }

        console.log(dimension)

        dimension.then((dims) => {
            console.log(dimension.width)
            var tmpArr = [];
            tmpArr.push({
                id: 1,
                name: 'URL',
                box_count: 2,
                width: dims.width,
                height: dims.height,
                url: this.state.inputUrl,
                formatType: getFormat(this.state.inputUrl),
            })
            this.setState({
                isFetching: false
            }, () => {
                console.log(tmpArr);
                this.props.setImagesArray(tmpArr, this.state.isFetching)
            })
        })

    }


    render() {
        return (
            <div>
                <input type="text" id="image-url-input" value={this.state.inputValue} className="input-box" onChange={this.updateUrl} />
                <button id="image-url-input-button" className="button" onClick={this.submitUrl}> Get Image from URL </button>
            </div>
        );
    }
}

export default IfUrlComponent