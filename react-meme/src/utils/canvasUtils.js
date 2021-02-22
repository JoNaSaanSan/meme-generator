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

  export const retrieveImage = (canvasType, width, height) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        canvas.width = width;
        canvas.height =  height;
        const context = canvas.getContext("2d");

        const canvasBackground = document.getElementById("canvas-background");
        const canvasImages = document.getElementById("canvas-images");
        const canvasDraw = document.getElementById("canvas-draw");
        const canvasText = document.getElementById("canvas-text");
        try {
            context.drawImage(canvasBackground, 0, 0);
            const canvasTemplateData = canvas.toDataURL("image/png");
            if (canvasType === 'background')
                resolve(canvasTemplateData);

            context.drawImage(canvasImages, 0, 0);
            context.drawImage(canvasDraw, 0, 0);
            context.drawImage(canvasText, 0, 0);

            const canvasImageData = canvas.toDataURL("image/png");
            resolve(canvasImageData);
        } catch (e) {
            console.log(e)
        }
    });
}

