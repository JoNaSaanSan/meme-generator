const React = require('react')
// This component enables the user to upload images from the local s
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isFetching: false,
            inputUrl: '',
        }

        this.openModalHandler = this.openModalHandler.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.submitUrl = this.submitUrl.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
    }

    openModalHandler() {
        this.setState({ isModalOpen: true });
    }

    closeModalHandler() {
        this.setState({ isModalOpen: false });
    }


    updateUrl(e) {

        try {
            this.setState({
                inputUrl: e.target.value,
                isFetching: true
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    submitUrl() {
        console.log(this.state.inputUrl)

        let data = []
        for (var i = 0; i < 1; i++) {
            data.push({
                id: i,
                name: 'URL',
                box_count: 2,
                width: 400,
                height: 400,
                url: this.state.inputUrl,
            });
        }
        this.setState({
            isFetching: false
        }, () => this.props.setImagesArray(data, this.state.isFetching))
    }


    render() {

        return (
            <div id="image-url-container" >
                <input type="text" id="image-url-input" value={this.state.inputValue} className="input-box" onChange={this.updateUrl} />
                <button id="image-url-input-button" className="button" onClick={this.submitUrl}> Get Image from URL </button>
            </div>
        );
    }
}

export default IfUrlComponent