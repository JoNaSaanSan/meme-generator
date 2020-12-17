
const React = require('react');
require('./ResultComponent.css');

class ResultComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
      generatedID: '',
      generatedName: '',
      generatedWidth: '',
      generatedHeight: '',
      generatedImgURL: '',
    }
    
    this.generateMeme = this.generateMeme.bind(this);
  }
  generateMeme() {
    // do something
    // POST request using fetch with error handling
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.props.state)
    };
    fetch(this.props.URL + '/generateMeme', requestOptions)
      .then(async response => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        this.setState({
          generatedID: data.id,
          generatedName: data.name,
          generatedImgURL: data.URL,
          generatedHeight: data.height,
          generatedWidth: data.width,
        })
      })
      .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
      });
  }


  render() {
    return (
      <div class="Result">
      <div id="resultImage">
        <div class="resultImageNumber"></div>
        <h2> {this.state.generatedName}</h2>
        <p>Nothing generated yet.</p>
        <img src={this.state.generatedImgURL} alt="Target" />
      </div>

      <button onClick={this.generateMeme}>Generate</button>
    </div>
    )
  }
}




export default ResultComponent;
