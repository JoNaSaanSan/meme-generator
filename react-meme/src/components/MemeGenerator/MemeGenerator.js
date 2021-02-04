import ControlsComponent from './MemeGeneratorComponents/ControlsComponent';
import ImageComponent from './MemeGeneratorComponents/ImageComponent';
import PreviewComponent from './MemeGeneratorComponents/PreviewComponent';
import Store from '../../redux/store';
require('./MemeGenerator.css');
const React = require('react');

class MemeGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      URL: 'http://localhost:3000/memes/sampleMemes',
      currentMeme: '',
      generatedMeme: '',
      inputBoxes: [],
      isSignedIn: Store.getState().user.isSignedIn,

    }
  }


  // Initialize
  componentDidMount() {

  }

  setCurrentMeme = (currentMemeFromChild) => {
    this.setState({
      currentMeme: currentMemeFromChild,
    })
  }

  setInputBoxes = (inputBoxesFromChild) => {
    this.setState({
      inputBoxes: inputBoxesFromChild,
    }) 
  }




  render() {
    // Redux: Update Signed in State
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

    return (
      <div class="generator-view">
        <div class="outer-container">
          <ControlsComponent
            URL={this.state.URL}
            setInputBoxes={this.setInputBoxes}
            generateMeme={() => this.generateMeme()}
            setCurrentMeme={this.setCurrentMeme} />
          <ImageComponent generateMeme={this.generateMeme} currentMeme={this.state.currentMeme} inputBoxes={this.state.inputBoxes} />
          <img src={this.state.generatedMeme.url} />
        </div>


      </div>
    )
  }
}

export default MemeGenerator;