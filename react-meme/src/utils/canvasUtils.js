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
  if (isBold) {
    style += 'bold '
  }
  if (isItalic) {
    style += 'italic '
  }
  var font = style + fontSize + "px " + fontFamily;
  context.font = font;
  var textWidth = context.measureText(inputText).width;
  return Math.ceil(textWidth)
}

export const retrieveImage = (canvasType, width, height, maxSize, scale) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    const canvasBackground = document.getElementById("canvas-background");
    const canvasImages = document.getElementById("canvas-images");
    const canvasDraw = document.getElementById("canvas-draw");
    const canvasText = document.getElementById("canvas-text");

    
    context.scale(scale, scale); 
    context.imageSmoothingEnabled = true;
    console.log("Scale" + scale)
    try {
      context.imageSmoothingEnabled = true;
      context.drawImage(canvasBackground, scale, scale);
      const canvasTemplateData = canvas.toDataURL("image/png");
      if (canvasType === 'background')
        resolve(canvasTemplateData);

      context.drawImage(canvasImages, scale, scale);
      context.drawImage(canvasDraw, scale, scale);
      context.drawImage(canvasText, scale, scale);

      const canvasImageData = canvas.toDataURL("image/png");
      var fileSize = (canvasImageData.length * (3 / 4)) - 2
      console.log(fileSize, maxSize)
      if (isNaN(maxSize) || maxSize < 1 || maxSize > fileSize) {
        resolve(canvasImageData);
      } else {
        var ratio = (Math.pow(fileSize, 0.5)/Math.pow(maxSize, 0.5));
        console.log("make smaller " +  ratio);
        retrieveImage(canvasType, width / ratio, height / ratio, maxSize, scale/ratio).then(result => resolve(result))
      }
    } catch (e) {
      console.log(e)
    }
  });
}

