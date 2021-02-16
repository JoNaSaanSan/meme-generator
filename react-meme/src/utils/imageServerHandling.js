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


