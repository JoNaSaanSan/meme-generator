export const getImageDimensions = (res) => {
    return new Promise((resolve, reject) => {
        var src;
        try {
            src = URL.createObjectURL(res)
        } catch (error) {
            src = res;
        }
        var img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(src);
        };
        img.src = src;
    });
};


export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            return resolve(img);
        }
        img.src = url;
    })
}


export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
};

/**W
 Returns the dimensions of a video asynchrounsly.
 @param {String} url Url of the video to get dimensions from.
 @return {Promise} Promise which returns the dimensions of the video in 'width' and 'height' properties.
 */
export const getVideoDimensions = (res) => {
    return new Promise((resolve, reject) => {
        var src;
        try {
            src = URL.createObjectURL(res)
        } catch (error) {
            src = res;
        }
        // create the video element
        let video = document.createElement('video');
        console.log(video)

        // place a listener on it
        video.addEventListener("loadedmetadata", function () {

            // retrieve dimensions
            let height = this.videoHeight;
            let width = this.videoWidth;
            // send back result
            resolve({
                width: width,
                height: height,
            });
            URL.revokeObjectURL(src);
        }, false);

        // start download meta-datas
        video.src = src;
    });
}



export const getFormat = (filename) => {
    var parts = filename.split('.');
    var ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
        case 'jpg':
            return 'image'
        case 'jpeg':
            return 'image'
        case 'gif':
            return 'gif'
        case 'bmp':
            return 'image'
        case 'png':
            return 'image'
        case 'm4v':
            return 'video'
        case 'avi':
            return 'video'
        case 'mpg':
            return 'video'
        case 'mp4':
            return 'video'
    }
    return false;
}


