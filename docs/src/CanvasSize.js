let resolutions = {
    qHD: 0,
    WXGA: 1,
    FHD: 2,
    QHD: 3,
}

let CanvasSize = {
    canvasWidth: 1280,
    canvasHeight: 720,

    setSize: (resolution) => {
        if (resolution === resolutions.qHD) {
            CanvasSize.canvasWidth = 960;
            CanvasSize.canvasHeight = 540;
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

    getFontSize: (resolution) => {
        if (resolution === resolutions.qHD) {
            return {small: 10, medium: 12, large: 14, huge: 18};
        } else if (resolution === resolutions.WXGA) {
            return {small: 16, medium: 18, large: 20, huge: 24};
        } else if (resolution === resolutions.FHD) {
            return {small: 20, medium: 22, large: 24, huge: 28};
        } else if (resolution === resolutions.QHD) {
            return {small: 24, medium: 26, large: 28, huge: 32};
        }
        return {small: 16, medium: 18, large: 20, huge: 24};
    }
}

export {resolutions, CanvasSize};

if (typeof module !== 'undefined') {
    module.exports = {resolutions, CanvasSize};
}