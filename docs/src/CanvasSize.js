let resolutions = {
    nHD: 0,
    WXGA: 1,
    FHD: 2,
    QHD: 3,
}

let CanvasSize = {
    canvasWidth: 1280,
    canvasHeight: 720,

    setSize: (resolution) => {
        if (resolution === resolutions.nHD) {
            CanvasSize.canvasWidth = width;
            CanvasSize.canvasHeight = height;
        } else if (resolution === resolutions.WXGA) {
            CanvasSize.canvasWidth = 1280;
            CanvasSize.canvasHeight = 720;
        } else if (resolution === resolutions.FHD) {
            CanvasSize.canvasWidth = 1920;
            CanvasSize.canvasHeight = 1080;
        } else if (resolution === resolutions.QHD) {
            CanvasSize.canvasWidth = 2560;
            CanvasSize.canvasHeight = 1440;
        }

    },

    getSize: () => {
        return [CanvasSize.canvasWidth, CanvasSize.canvasHeight];
    },

    getFontSize: () => {
        return {small: 16, medium: 18, large: 20, huge: 24};
    }
}

export {resolutions, CanvasSize};

if (typeof module !== 'undefined') {
    module.exports = {resolutions, CanvasSize};
}