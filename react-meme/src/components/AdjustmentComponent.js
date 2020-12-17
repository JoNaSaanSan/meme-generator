
const React = require('react');
require('./AdjustmentComponent.css');

class AdjustmentComponent extends React.Component {
  render() {
    return (
      <div>
        <div id="inputText"></div>
        <div id="inputColor"></div>

        <button onClick="generateMeme()">Generate</button>

        <button onClick="getSampleMeme()">Get Samples</button>

        <button onClick="saveMeme()">Save Meme</button></div>
    )
  }
}




export default AdjustmentComponent;
