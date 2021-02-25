import Store from '../../../../redux/store';
import { b64toBlob} from '../../../../utils/ImageUtils';
const React = require('react');

// This component fetches an array of images from the server
class IfTemplateComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            inputUrl: '',
            accessToken: null,
        }

        this.fetchImageFromUrl = this.fetchImageFromUrl.bind(this);
    }

    // Fetch all images from /samplememes and store them into a state array
    fetchImageFromUrl(url) {


        this.setState({
            isFetching: true
        });
        var tmpUrl;

        if (this.state.inputUrl.indexOf('://') === -1) {
            tmpUrl = 'https://' + this.state.inputUrl
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.state.accessToken,
            },
        };

        fetch(url, requestOptions)
            .then(async response => {
                response.json().then(fetchedData => {
                    try {
                        const templates = fetchedData.templates;
                        console.log(fetchedData.templates)

                        let data = []
                        for (var i = 0; i < templates.length; i++) {
                            const template = templates[i];
                            console.log(template)
                            var base64result = template.base64.split(',');
                            data.push({
                                id: 0,
                                name: template.title,
                                box_count: 2,
                                width: template.width || 400,//Todo: User width and height from image
                                height: template.height || 400,
                                url: URL.createObjectURL(b64toBlob(base64result[1], base64result[0])),
                                formatType: template.formatType,
                            });
                        }
                        this.setState({
                            isFetching: false,
                        }, () => this.props.setImagesArray(data, this.state.isFetching))
                    } catch (e) {
                        console.log(e)
                    }
                })
            })
    }

    render() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

        return (
            <div>
                <button onClick={() => this.fetchImageFromUrl(this.props.URL)} id="fetch-button" className="button" > {this.props.getImagesButtonName} </button>
            </div >
        )
    }
}

export default IfTemplateComponent;