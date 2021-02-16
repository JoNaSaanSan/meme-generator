/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth = (inputText, isBold, isItalic, fontSize, fontFamily) => {
    // re-use canvas object for better performance
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var style = '';
    if(isBold){
      style += 'bold '
    }
    if(isItalic){
      style += 'italic '
    }
    var font = style + fontSize + "px " + fontFamily;
    context.font = font;
    var textWidth = context.measureText(inputText).width;
    return Math.ceil(textWidth)
  }