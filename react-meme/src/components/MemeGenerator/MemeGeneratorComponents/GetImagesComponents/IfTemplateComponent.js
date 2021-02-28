import Store from '../../../../redux/store';
import { b64toBlob} from '../../../../utils/ImageUtils';
const React = require('react');

// This component fetches an array of templates from the server
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

   /**
    * 
    * @param {*} url 
    * Fetches all templates that has been uploaded to the database 
    * 
    */
    fetchImageFromUrl(url) {
        this.setState({
            isFetching: true
        });

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
                                width: template.width,//Todo: User width and height from image
                                height: template.height,
                                url: URL.createObjectURL(b64toBlob(base64result[1], base64result[0])),
                                formatType: template.fileType,
                                statistics: {used: template.used}
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