class Meme {
  constructor(url, id, width, height, name, boxcount) {
    this.url = url;
    this.id = id;
    this.width = width;
    this.height = height;
    this.name = name;
    this.boxcount = boxcount;
  }
}

var currentMeme;

window.addEventListener('DOMContentLoaded', function () {
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');
  const searchButton = document.getElementById('searchButton');

  var previewButtons = document.getElementsByClassName("previewButton")

  let memes = []

  const numberOfImages = () => memes.length;
  // this is a counter that holds the id / number of the currently displayed image.
  let currentImageID = 1;

  /**
   * shows the image by giving it the 'current' class
   * the CSS in the <style> block above specifies that only the slides
   * with the .current class are shown, the rest has display: none
   *
   * @param number {Number} id of the image.
   */

  function showImage(number) {
    let meme = memes[number]
    document.getElementById('slideShowImages').innerHTML = ''
    document.getElementById('slideShowImages').append(renderImage(meme.url, meme.width, meme.height, meme.name))
    currentImageID = number
    currentMeme = new Meme(meme.url, meme.id, meme.width, meme.height, meme.name, meme.box_count)
    createInputBoxes(currentMeme.boxcount)

    console.log(`showing image ${number}`)
    loadPreviewItems()

  }

  backButton.addEventListener('click', function () {
    currentImageID = currentImageID == 0 ? numberOfImages() - 1 : currentImageID - 1;
    showImage(currentImageID);
  });
  nextButton.addEventListener('click', function () {
    currentImageID = currentImageID == numberOfImages() - 1 ? 0 : currentImageID + 1;
    showImage(currentImageID);
  });

  for (i = 0; i < previewButtons.length; i++) {
    previewButtons[i].addEventListener('click', function () {
      newImageID = currentImageID + Number(this.id.slice(-1)) - 3
      newImageID = newImageID < 0 ? numberOfImages() - 1 : newImageID
      newImageID = newImageID > numberOfImages() - 1 ? 0 : newImageID
      console.log("clicked on image ", newImageID)
      showImage(newImageID)
    })
  }



  // Added Event Listner to search something
  searchButton.addEventListener('click', function () {
    searchImage()
  });

  searchButton.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === 13) {
      searchImage()
    }
  });

  function searchImage() {
    for (i = 0; i < memes.length; i++) {
      if (memes[i].name.toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
        console.log("found")
        showImage(i);
      }
    }
  }

  /**
  (re)loads the images for the current filter config
  */
  function loadImageUrls() {
    // TODO load meme template images from the Imgflip API
    const URL = "http://localhost:3000/samplememes";

    fetch(URL)
      .then((resp) => resp.json()) // Transform the data into json
      .then(function (data) {
        memes = data.data.memes
        showImage(0)
      }).catch(requestError => {
        console.error(requestError);
      });
    }
    
  loadImageUrls();

  function loadPreviewItems() {
    var n = 0
    for (i = currentImageID - 2; i < currentImageID + 3; i++) {
      n += 1
      j = i < 0 ? numberOfImages() + i : i
      j = j > numberOfImages() - 1 ? j - numberOfImages() : j

      const meme = memes[j]

      previewMeme = document.getElementById("preview" + n)
      previewMeme.src = meme.url
      previewMeme.height = 80
      previewMeme.width = 80


      if (currentMeme.id == meme.id) {
        previewMeme.classList.add('previewSelected');
      } else {
        previewMeme.classList.remove('previewSelected');
      }
    }

  }

});

function createInputBoxes(amount) {
  console.log("create Boxes" + amount)

  while (document.getElementById('inputText').firstChild) {
    document.getElementById('inputText').removeChild(document.getElementById('inputText').lastChild);
  }

  while (document.getElementById('inputColor').firstChild) {
    document.getElementById('inputColor').removeChild(document.getElementById('inputColor').lastChild);
  }

  for (var i = 0; i < amount; i++) {
    var input = document.createElement("input");
    input.type = "text";
    input.className = "inputClass"; // set the CSS class
    input.id = "textBox_" + i;
    document.getElementById('inputText').appendChild(input); // put it into the DOM


    var inputColor = document.createElement("input");
    inputColor.type = "color";
    inputColor.className = "inputColorClass"; // set the CSS class
    inputColor.id = "color_" + i;
    document.getElementById('inputColor').appendChild(inputColor); // put it into the DOM
  }
}

// Rendering Image
function renderImage(url, width, height, name) {
  const figure = document.createElement('figure');
  figure.className = "slidecurrent";
  const newImage = document.createElement('img');
  newImage.src = url;
  newImage.width = width;
  newImage.height = height;
  const figCaption = document.createElement('figcaption');
  figCaption.innerHTML = `${name}   ${url}`;

  figure.appendChild(newImage);
  figure.appendChild(figCaption);

  return figure
}


// Generating Meme using imgflip api with post request
function generateMeme() {
  const url = "https://api.imgflip.com/caption_image"


  var boxArray = [];
  var childColor = document.getElementById('inputColor').firstElementChild

  for (var child = document.getElementById('inputText').firstChild; child !== null; child = child.nextSibling) {

    var textObject = new Object();
    textObject.text = child.value;
    textObject.color = "%23" + childColor.value.substring(1);
    boxArray.push(textObject);
    childColor = childColor.nextElementSibling;
  }



  const username = "SandraOMM"
  const password = "onlinemultimedia2020"

  if (currentMeme != null) {
    var urlReq = url + "?template_id=" + currentMeme.id + "&username=" + username + "&password=" + password + "&text0=" + "1" + "&text1=" + "2"


    for (var i = 0; i < boxArray.length; i++) {
      for (var y = 0; y < Object.keys(boxArray[i]).length; y++) {
        urlReq = urlReq + "&boxes[" + i + "][" + Object.keys(boxArray[i])[y] + "]=" + boxArray[i][Object.keys(boxArray[i])[y]]
      }
    }

    console.log(urlReq)

    try {
      fetch(urlReq, {
        method: "POST",
      }).then((resp) => resp.json())
        .then(function (data) {
          console.log(data)
          console.log(currentMeme)
          document.getElementById('resultImage').innerHTML = ''
          document.getElementById('resultImage').append(renderImage(data.data.url, currentMeme.width, currentMeme.height, currentMeme.name))
        })
    } catch (err) {
      console.log(err.message);
    }
  }
}