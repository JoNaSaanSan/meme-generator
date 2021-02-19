// TextBoxes Class
class TextBoxes {
    constructor(textID, text, textPosX, textPosY, fontColor, fontFamily, fontSize, outlineWidth, outlineColor, isItalic, isBold, isVisible) {
      this.textID = textID;
      this.text = text;
      this.textPosX =  textPosX;
      this.textPosY =  textPosY;
      this.fontColor = fontColor;
      this.fontFamily = fontFamily;
      this.fontSize =  fontSize;
      this.outlineWidth =  outlineWidth;
      this.outlineColor =  outlineColor;
      this.isItalic = isItalic;
      this.isBold = isBold;
      this.isVisible = isVisible;
    }
  }

  export default TextBoxes