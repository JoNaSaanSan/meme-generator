const React = require('react')
// This component enables the user to upload images from the local s
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isFetching: false,
            url: '',
        }

        this.openModalHandler = this.openModalHandler(this);
        this.closeModalHandler = this.closeModalHandler(this);
        this.submitUrl = this.submitUrl(this);
        this.updateUrl = this.updateUrl(this);
    }

    openModalHandler() {
        this.setState({ isModalOpen: true });
    }

    closeModalHandler() {
        this.setState({ isModalOpen: false });
    }


    updateUrl(e) {
        console.log(e)
        try {
            this.setState({
                url: '',
                isFetching: true
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    submitUrl() {
        console.log("submit")

        var tmpUrl
        if (this.state.url !== '') {
            tmpUrl = this.state.url;
        }
        let data = []
        for (var i = 0; i < 1; i++) {
            data.push({
                id: i,
                name: 'URL',
                box_count: 2,
                width: 400,
                height: 400,
                url: tmpUrl,
            });
        }
        this.setState({
            isFetching: false
        })
        this.props.setImagesArray(data, this.state.isFetching);
    }


    render() {

        return (
            <div id="image-url-container" >
                <input type="text" id="image-url-input" className="input-box" onChange={this.updateUrl} />
                <button id="image-url-input-button" className="button" onClick={this.submitUrl}> Get Image from URL </button>
            </div>
        );
    }
}

export default IfUrlComponent