const React = require('react');
require('./TextUIComponent.css');

class TextUIComponent extends React.Component {

  constructor(props) {
    super(props);


    // Binds
    this.createUI = this.createUI.bind(this);
    this.addTextBoxes = this.addTextBoxes.bind(this);
  }


  /**
   * 
   * @param {number} i The index number of the text box
   * @param {Event} event The event which is triggering this function
   * This function passes the index, event name and event value to the Meme Generator Component, which then handles the change of the input boxes
   * 
   */
  handleChange(i, event) {

    // Handle Bold and Italic Buttons
    if (event.target.name === 'isBold') {
      this.props.handleInputBoxesChange(i, { target: { name: 'isBold', value: !this.props.currentInputBoxes[i].isBold } });
      const div = document.getElementById("bold-toggle-button_" + i);
      if (!this.props.currentInputBoxes[i].isBold) {
        div.className = "toggle-button";
      } else {
        div.className = "toggle-button-pressed bold-button";
      }

    } else if (event.target.name === 'isItalic') {
      this.props.handleInputBoxesChange(i, { target: { name: 'isItalic', value: !this.props.currentInputBoxes[i].isItalic } });
      const div = document.getElementById("italic-toggle-button_" + i);
      if (!this.props.currentInputBoxes[i].isItalic) {
        div.className = "toggle-button";
      } else {
        div.className = "toggle-button-pressed italic-button";
      }

    } else if (event.target.name === 'isVisible') {
      this.props.handleInputBoxesChange(i, { target: { name: 'isVisible', value: !this.props.currentInputBoxes[i].isVisible } });
      const div = document.getElementById("visible-toggle-button_" + i);
      if (!this.props.currentInputBoxes[i].isVisible) {
        div.className = "toggle-button visible-button";
        div.innerHTML = 'Show'
      } else {
        div.className = "toggle-button-pressed visible-button";
        div.innerHTML = 'Hide'
      }
    } else {
      this.props.handleInputBoxesChange(i, event);
    }
  }

  /**
   *  This function adds input boxes dynamically.
   *  It adds as many text boxes as defined by the meme object.
   * 
   */
  createUI() {
    if (this.props.currentInputBoxes !== null && this.props.currentInputBoxes !== undefined) {
      return this.props.currentInputBoxes.map((el, i) =>
        <div key={i} className="text-item">
          <div>
            <button id={"visible-toggle-button_" + i} className="toggle-button visible-button" name="isVisible" value={this.props.currentInputBoxes[i].isVisible} onClick={this.handleChange.bind(this, i)}> Hide </button>
          </div>
          <p>Text</p>
          <div>
            <input type="text" id={"text-input_" + i} placeholder="Text" name="text" value={this.props.currentInputBoxes[i].text} className="input-box" onChange={this.handleChange.bind(this, i)} />
          </div>
          <p>Font</p>
          <div>
            <input type="text" placeholder="50" name="fontSize" value={this.props.currentInputBoxes[i].fontSize} className="number-input-box" min="1" max="1000" maxLength="3" onChange={this.handleChange.bind(this, i)} />
            <select name="fontFamily" className="input-box" value={this.props.currentInputBoxes[i].fontFamily} onChange={this.handleChange.bind(this, i)}>
              <option value="Impact">Impact</option>
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Courier">Courier</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
            <input type="color" name="fontColor" className="color-input-box" value={this.props.currentInputBoxes[i].fontColor} onChange={this.handleChange.bind(this, i)} />
          </div>
          <p>Outline</p>
          <div className="text-styling-container">
            <button id={"bold-toggle-button_" + i} className="toggle-button" name="isBold" value={this.props.currentInputBoxes[i].isBold} onClick={this.handleChange.bind(this, i)}> B </button>
            <button id={"italic-toggle-button_" + i} className="toggle-button" name="isItalic" value={this.props.currentInputBoxes[i].isItalic} onClick={this.handleChange.bind(this, i)}> I </button>
            <input type="text" placeholder="3" name="outlineWidth" value={this.props.currentInputBoxes[i].outlineWidth} className="number-input-box" min="1" max="50" onChange={this.handleChange.bind(this, i)} />
            <input type="color" name="outlineColor" value={this.props.currentInputBoxes[i].outlineColor} className="color-input-box" onChange={this.handleChange.bind(this, i)} />
          </div>
          <p>Position</p>
          <div>
            <input type="number" placeholder="200" name="textPosX" value={this.props.currentInputBoxes[i].textPosX} className="dimension-input-box" min="1" max="5000" maxLength="2" onChange={this.handleChange.bind(this, i)} />
            <input type="number" placeholder="200" name="textPosY" value={this.props.currentInputBoxes[i].textPosY} className="dimension-input-box" min="1" max="5000" maxLength="2" onChange={this.handleChange.bind(this, i)} />
          </div>
        </div>)
    } else {
      return;
    }
  }

  /**
   * calls add textboxes in parent
   */
  addTextBoxes() {
    this.props.addTextBoxes();
  }


  render() {
    return (
      <div id="ui-buttons" className="ui-view">
        <div className="image-text-boxes-container">
          {this.createUI()}
          <button onClick={this.addTextBoxes} id="add-textboxes-button" className="button" > Add Text </button>
        </div>
      </div>
    )
  }
}

export default TextUIComponent;