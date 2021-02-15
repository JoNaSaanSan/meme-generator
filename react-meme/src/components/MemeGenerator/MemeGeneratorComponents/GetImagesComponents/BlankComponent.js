const React = require('react')
// This component enables the user to upload images from the local device
class BlankComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
        }

        this.getBlankImage = this.getBlankImage.bind(this);
    }
    getBlankImage() {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        canvas.width = 400;
        canvas.height = 400;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let data = []
        for (var i = 0; i < 1; i++) {
            data.push({
                id: i,
                name: 'Blank',
                box_count: 2,
                width: 1200, //Todo: User width and height from image
                height: 1200,
                url: canvas.toDataURL("image/png"),
            });
        }
        this.setState({
            isFetching: false
        }, () => this.props.setImagesArray(data, this.state.isFetching))
    }


    render() {
        return (
            <div>
                <button id="blank-image-input-button" className="button" onClick={this.getBlankImage}> Blank Image </button>
            </div>
        );
    }
}

export default BlankComponent