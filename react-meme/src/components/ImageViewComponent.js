import ControlsComponent from './ImageViewComponents/ControlsComponent';
import ImageComponent from './ImageViewComponents/ImageComponent';
import PreviewComponent from './PreviewComponent';
import Store from '../redux/store';
const React = require('react');
require('./ImageViewComponent.css');

const initializeText = {
  textID: '',
  text: '',
  fontColor: '#ffffff',
  fontFamily: '',
  fontSize: '50px',
}


// This component handles the current Meme State and all surver communication
class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      currentMeme: '',
      generatedMeme: '',
      // Index of array
      index: 0,

      isSignedIn: Store.getState().user.isSignedIn,

      //Handle inputTextBoxes
      inputBoxes: [
        {
          textID: initializeText.textID,
          text: initializeText.text,
          fontColor: initializeText.fontColor,
          fontFamily: initializeText.fontFamily,
          fontSize: initializeText.fontSize,
        }
      ],
    }

    // Binds
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.saveMeme = this.saveMeme.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
  }

  // Initialize
  componentDidMount() {
    this.setCurrentMemeState(0);
  }

  // Set Current Meme State with index
  setCurrentMemeState(index) {
    var newInputBoxesArray = [];
    for (var i = 0; i < this.props.samplesMemeArray[index].box_count; i++) {
      // Check if box is undefined
      if (this.state.inputBoxes[i] !== undefined) {
        newInputBoxesArray.push({
          textID: i, 
          text: this.state.inputBoxes[i].text, 
          fontColor: this.state.inputBoxes[i].fontColor,
          fontFamily: this.state.inputBoxes[i].fontFamily, 
          fontSize: this.state.inputBoxes[i].fontSize
        });
      } else {
        newInputBoxesArray.push({ 
          textID: i, 
          text: initializeText.text, 
          fontColor: initializeText.fontColor,
          fontFamily: initializeText.fontFamily, 
          fontSize: initializeText.fontSize,
        });
      }
    }

    this.setState({
      currentMeme: this.props.samplesMemeArray[index],
      index: index,
      inputBoxes: newInputBoxesArray,
    })
  }

  // Handle Events when Text or Color Inputs changed and store it in the inputBoxesStates
  handleChange(i, event) {
    console.log(event.target.name + " XX " +event.target.value)
    this.setState(prevState => ({
      inputBoxes: prevState.inputBoxes.map(
        obj => (obj.textID === i ? Object.assign(obj, { [event.target.name]: event.target.value }) : obj)
      )
    }));
  }



  //Generate Meme
  generateMeme() {

    console.log(this.state.currentMeme)

    // POST request using fetch with error handling
    var memeObject = {};
    memeObject.id = this.state.currentMeme.id;
    memeObject.inputBoxes = this.state.inputBoxes

    console.log(memeObject)
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
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        var tmp = {};
        tmp.url = data.data.url;


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

  // Save Meme / Send to server
  saveMeme() {
    // POST request using fetch with error handling
    console.log(this.state.generatedMeme + "access Token: " + this.props.accessToken)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.generatedMeme)
    };
    fetch(this.props.URL + '/memes/saveMeme', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch(error => {
        this.setState({
          errorMessage: error.toString()
        });
        console.error('There was an error!', error);
      });
  }

  // Render
  render() {
    // Redux: Update Signed in State
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

    return (
      <div class="generator-view">
        <div class="outer-container">
          <ControlsComponent URL={this.state.URL} inputBoxes={this.state.inputBoxes} index={this.state.index} samplesMemeArray={this.props.samplesMemeArray} setCurrentMemeState={newIndex => this.setCurrentMemeState(newIndex)} generateMeme={() => this.generateMeme()} handleChange={(i) => this.handleChange.bind(this, i)} />
          <ImageComponent generateMeme={this.generateMeme} currentMeme={this.state.currentMeme} inputBoxes={this.state.inputBoxes} />
        <img src={this.state.generatedMeme.url} />
        </div>

        <PreviewComponent samplesMemeArray={this.props.samplesMemeArray} indexPos={this.state.index} setCurrentMemeState={this.setCurrentMemeState} />
      </div>
    )
  }
}

export default ImageViewComponent;