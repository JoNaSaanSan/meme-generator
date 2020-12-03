class Meme {
  constructor(url, id, width, height, name) {
    this.url = url;
    this.id = id;
    this.width = width;
    this.height = height;
    this.name = name;
  }
}

var currentMeme;

window.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');
  const searchButton = document.getElementById('searchButton');


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
    currentMeme = new Meme(meme.url, meme.id, meme.width, meme.height, meme.name)
    console.log(currentMeme)
    console.log(memes)
    console.log(`showing image ${number}`)
  }

  backButton.addEventListener('click', function() {
    currentImageID = currentImageID == 0 ? numberOfImages() - 1 : currentImageID - 1;
    showImage(currentImageID);
  });
  nextButton.addEventListener('click', function() {
    currentImageID = currentImageID == numberOfImages() - 1 ? 0 : currentImageID + 1;
    showImage(currentImageID);
  });


  // Added Event Listner to search something
  searchButton.addEventListener('click', function() {
    searchImage()
  });

  searchButton.addEventListener("keyup", function(event) {
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
    const URL = "https://api.imgflip.com/get_memes";

    fetch(URL)
      .then((resp) => resp.json()) // Transform the data into json
      .then(function(data) {
        memes = data.data.memes
        showImage(0)
      });
  }
  loadImageUrls();

});

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
  let topText = document.querySelector("#topText").value;
  let bottomText = document.querySelector("#bottomText").value;

  const username = "SandraOMM"
  const password = "onlinemultimedia2020"

  if (currentMeme != null) {
    var urlReq = url + "?template_id=" + currentMeme.id + "&username=" + username + "&password=" + password + "&text0=" + topText + "&text1=" + bottomText

    try {
      fetch(urlReq, {
          method: "POST"
        }).then((resp) => resp.json())
        .then(function(data) {
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