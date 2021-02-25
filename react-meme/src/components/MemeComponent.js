const React = require('react');


class HeaderComponent extends React.Component {

    constructor(props) {
        super(props);
        // Init state
        this.state = {
            url: 'http://localhost:3000/memes/',
            imageData: null
        }
    }

    componentDidMount() {

        this.fetchImage()

    }


    fetchImage() {
        console.log("Fetch")
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(this.state.url + this.props.match.params.id, requestOptions)
            .then(async response => {
              response.json().then(data =>

                    this.setState({
                        imageData: data.base64
                    })

                )

            }
            )
            .catch(error => {
                this.setState({
                    errorMessage: error.toString()
                });
                console.error('There was an error!', error);
            });
    }

    render() {
        return (
            <div>
                <img src={this.state.imageData} />

            </div >
        );
    }

}

export default HeaderComponent;