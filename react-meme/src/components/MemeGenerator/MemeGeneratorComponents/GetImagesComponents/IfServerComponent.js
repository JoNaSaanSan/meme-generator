const React = require('react');


// This component fetches an array of images from the server
class IfServerComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
        }
    }

    /**
     *  Fetch all images from /samplememes and store them into a state array
    */
     fetchImages(url) {
        this.setState({
            isFetching: true
        });

        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {

                // Populate Meme Array
                this.setState({
                    isFetching: false
                })
                
                this.props.setImagesArray(data, this.state.isFetching);
                console.log("Fetching Memes is done!")
            }).catch(error => {
                console.log(error);
                // finish fetchnig
                this.setState({
                    isFetching: false
                })
            });
    }

    render() {
        return (
            <div>
                <button onClick={() => this.fetchImages(this.props.URL  + '/memes/sampleMemes')} id="fetch-button" className="button" > {this.props.getImagesButtonName} </button>
            </div>
        )
    }
}

export default IfServerComponent;