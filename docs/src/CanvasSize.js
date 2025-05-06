let resolutions = {
    qHD: 0,      // qHD mode (e.g., 960x540)
    WXGA: 1,     // WXGA mode (e.g., 1280x720)
    FHD: 2,      // FHD mode (e.g., 1920x1080)
    QHD: 3,      // QHD mode (e.g., 2560x1440)
}

let CanvasSize = {
    canvasWidth: 1280,   // Default canvas width
    canvasHeight: 720,   // Default canvas height
    currentResolution: resolutions.WXGA,

    setSize: (resolution) => {
        CanvasSize.currentResolution = resolution;
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

    getScaleFactor() {
        return CanvasSize.canvasWidth / 1280;
    },

    getSize: () => {
        return [CanvasSize.canvasWidth, CanvasSize.canvasHeight];
    },

    getFontSize: () => {
        if (CanvasSize.currentResolution === resolutions.qHD) {
            return {mini: 10, letter: 14, small: 16, medium: 18, large: 20, huge: 24};
        } else if (CanvasSize.currentResolution === resolutions.WXGA) {
            return {mini: 14, letter: 18, small: 20, medium: 22, large: 24, huge: 28};
        } else if (CanvasSize.currentResolution === resolutions.FHD) {
            return {mini: 18, letter: 22, small: 24, medium: 26, large: 28, huge: 32};
        } else if (CanvasSize.currentResolution === resolutions.QHD) {
            return {mini: 22, letter: 26, small: 28, medium: 30, large: 32, huge: 36};
        }
        return {mini: 14, letter: 18, small: 20, medium: 22, large: 24, huge: 28};
    },

    detectResolution: (windowWidth, windowHeight) => {
        if (windowWidth < 1000) {
            return resolutions.qHD;
        } else if (windowWidth < 1400) {
            return resolutions.WXGA;
        } else if (windowWidth < 2000) {
            return resolutions.FHD;
        } else {
            return resolutions.QHD;
        }
    }
}

export {resolutions, CanvasSize};

if (typeof module !== 'undefined') {
    module.exports = {resolutions, CanvasSize};
}
