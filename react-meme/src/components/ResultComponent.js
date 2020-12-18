const React = require('react');
require('./ResultComponent.css');



class ResultComponent extends React.Component {

  constructor(props) {
    super(props);

    this.boxes = [];
    // Init state
    this.state = {
      generatedID: '',
      generatedName: '',
      generatedWidth: '',
      generatedHeight: '',
      generatedImgURL: '',
    }

    this.generateMeme = this.generateMeme.bind(this);
    this.retrieveBoxes = this.retrieveBoxes.bind(this);
  }

  retrieveBoxes() {
    var boxArray = [];
    var childColor = document.getElementById('inputColor').firstElementChild

    for (var child = document.getElementById('inputText').firstChild; child !== null; child = child.nextSibling) {

      var textObject = {};
      textObject.text = child.value;
      textObject.color = "%23" + childColor.value.substring(1);
      boxArray.push(textObject);
      childColor = childColor.nextElementSibling;
    }
    this.boxes = boxArray;
  }


  generateMeme() {
    // do something
    // POST request using fetch with error handling

    this.retrieveBoxes();

    console.log(this.boxes)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props.ID, this.state.boxes)
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

        this.setState({
          generatedID: data.id,
          generatedName: data.name,
          generatedImgURL: data.URL,
          generatedHeight: data.height,
          generatedWidth: data.width,
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

      <div className="Result" >
        <div id="resultImage" >
          <div className="resultImageNumber" > </div>
          <h2 > {
            this.state.generatedName
          } </h2> <p > Nothing generated yet. </ p> <
            img src={
              this.state.generatedImgURL
            }
            alt="Target" />
        </div>

        <button onClick={this.generateMeme
        } > Generate </button> </div>
    )
  }
}




export default ResultComponent;