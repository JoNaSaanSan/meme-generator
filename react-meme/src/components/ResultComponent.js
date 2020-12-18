import Meme from './Meme'
const React = require('react');
require('./ResultComponent.css');

class ResultComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      generatedMeme: '',
    }
    this.generateMeme = this.generateMeme.bind(this);
  }

  //Generate Meme
  generateMeme() {
    // POST request using fetch with error handling
    var memeObject = {};
    memeObject.id = this.props.currentMeme.id;
    memeObject.inputBoxes = this.props.inputBoxes
    console.log(JSON.stringify(memeObject))
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memeObject)
    };
    fetch(this.props.URL + '/memes/generateMeme', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(response);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        var tmp = new Meme();
        tmp.url = data.url;

        this.setState({
          generatedMeme: tmp,
        })
      })
      .catch(error => {
        this.setState({
          errorMessage: error.toString()
        });
        console.error('There was an error!', error);
      });
  }


  render() {
    return (

      <
      div className = "Result" >
      <
      div id = "resultImage" >
      <
      div className = "resultImageNumber" > < /div> <
      h2 > {
        this.state.generatedName
      } < /h2> <p > Nothing generated yet. </
      p > < img src = {
        this.state.generatedMeme.url
      }
      alt = "Target" / >
      <
      /div>

      <
      button onClick = {
        this.generateMeme
      } > Generate < /button> </div >
    )
  }
}




export default ResultComponent;