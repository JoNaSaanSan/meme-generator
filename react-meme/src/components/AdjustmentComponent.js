
const React = require('react');
require('./AdjustmentComponent.css');

class AdjustmentComponent extends React.Component {
  render() {
    return (
      <div>
        <div id="inputText"></div>
        <div id="inputColor"></div>

        <button onclick="generateMeme()">Generate</button>

        <button onclick="getSampleMeme()">Get Samples</button>

        <button onclick="saveMeme()">Save Meme</button></div>
    )
  }
}




export default AdjustmentComponent;
