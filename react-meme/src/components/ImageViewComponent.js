const React = require('react');
require('./ImageViewComponent.css');


class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      currentMeme: '',
      generatedMeme: '',
      // Index of array
      index: 0,

      //Handle inputTextBoxes
      inputBoxes: [
        {
          textID: '',
          text: '',
          color: '',
        }
      ],
    }

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.createUI = this.createUI.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
    this.saveMeme = this.saveMeme.bind(this);
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
        newInputBoxesArray.push({ textID: i, text: this.state.inputBoxes[i].text, color: this.state.inputBoxes[i].color });
      } else {
        newInputBoxesArray.push({ textID: i, text: '', color: '' });
      }
    }

    this.setState({
      currentMeme: this.props.samplesMemeArray[index],
      index: index,
      inputBoxes: newInputBoxesArray,
    })
  }

  //Set new index with step
  setNewIndex(step) {
    var newIndex = (this.state.index + step + (this.props.samplesMemeArray.length)) % (this.props.samplesMemeArray.length)
    this.setCurrentMemeState(newIndex)
  }

  // Previous Button
  prevButton() {
    this.setNewIndex(-1)
  }

  // Next Button
  nextButton() {
    this.setNewIndex(1)
  }

  // Search Function
  searchImage() {
    for (var i = 0; i < this.props.samplesMemeArray.length; i++) {
      if (this.props.samplesMemeArray[i].name.toLowerCase().includes(document.getElementById('search-text-box').value.toLowerCase())) {
        console.log("found " + i)
        this.setCurrentMemeState(i)
      }
    }
  }

  // Add Input Boxes (Text & Color) depending on the meme boxcount
  createUI() {
    return this.state.inputBoxes.map((el, i) =>
      <div key={i}>
        <input type="text" class="text-box" onChange={this.handleChange.bind(this, i)} />
        <input type="color" class="color-box" onChange={this.handleChange.bind(this, i)} />
      </div>)
  }

  // Handle Events when Text or Color Input changed and store it in the inputBoxesStates
  handleChange(i, event) {
    this.setState(prevState => ({
      inputBoxes: prevState.inputBoxes.map(
        obj => (obj.textID === i ? Object.assign(obj, { [event.target.type]: event.target.value }) : obj)
      )
    }));
  }

  //Generate Meme
  generateMeme() {
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
    console.log(this.state.generatedMeme)
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
    return (
      <div class="generator-view">
        <div class="outer-container">
          <div id="control-view">
            <div class="inner-grid" id="left-container">
              <h1 id="header-text"> Meme Generator </h1>
              <input type="text" id="search-text-box" class="text-box" />
              <button id="search-button" class="button" onClick={this.searchImage}> Search </button>
              <button onClick={this.prevButton} id="prev-button" class="button" > Back </button>
              <button onClick={this.nextButton} id="next-button" class="button" > Next </button>
              <button onClick={this.generateMeme} id="generate-button" class="button" > Generate</button>

            </div>
            <p>Insert text below </p>
            <div id="ui-buttons"> {this.createUI()}</div>
          </div>
          <div class="image-view" id="center-container">
            <h2 > {this.state.currentMeme.name} </h2>
            <div className="image-display" >
              <img src={this.state.currentMeme.url} onError={i => i.target.style.display = 'none'}
                alt="Target" id="image-template" /></div>
          </div>

          <div class="image-view" id="right-container">
            <h2 id="generated-title"> Generated Image: {this.state.generatedName}</h2>
            <div className="image-display" >
              <img src={this.state.generatedMeme.url} onError={i => i.target.src = ''} alt="Generated" id="image-template" /></div>
            <div className="button-view" >
              <button onClick={this.saveMeme} id="save-button" class="button" > Save Meme </button>
            </div>
          </div >


        </div>
      </div>
    )
  }
}

export default ImageViewComponent;