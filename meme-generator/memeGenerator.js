var memeID;


window.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');

    const URL = "https://api.imgflip.com/get_memes";

    var request = new XMLHttpRequest();

    fetch(URL)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) {
            let memes = data.data.memes


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
                memeID = meme.id;
                console.log(`showing image ${number}`)
            }

            backButton.addEventListener('click', function () {
                currentImageID = currentImageID == 0 ? numberOfImages() - 1 : currentImageID - 1;
                showImage(currentImageID);
            });
            nextButton.addEventListener('click', function () {
                currentImageID = currentImageID == numberOfImages() - 1 ? 0 : currentImageID + 1;
                showImage(currentImageID);
            });

            /**
            (re)loads the images for the current filter config
            */
            function loadImageUrls() {
                // TODO load meme template images from the Imgflip API
                showImage(0)
            }

            loadImageUrls();

        })
});


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





function generateMeme() {
    const url = "https://api.imgflip.com/caption_image"
    let topText = document.querySelector("#topText").value;
    let bottomText = document.querySelector("#bottomText").value;

    /*var text = JSON.stringify({
        template_id: memeID,
        username: "SandraOMM",
        password: "onlinemultimedia2020",
        text0: document.querySelector("#topText").value,
        text1: document.querySelector("#bottomText").value
    })*/

    //var text = "template_id=memeID&username=SandraOMM&password=onlinemultimedia2020&text0=test&text1=test"

    const username = "SandraOMM"
    const password = "onlinemultimedia2020"

    var urlReq = url + "?template_id=" + memeID + "&username=" + username + "&password=" + password + "&text0=" + topText + "&text1=" + bottomText

    try {
        fetch(urlReq, {
            method: "POST"
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log(data.data.url)
                document.getElementById('resultImage').innerHTML = ''
                document.getElementById('resultImage').append(renderImage(data.data.url, 400, 400, "result"))
            })
    }
    catch (err) {
        console.log(err.message);
    }
}