export let CanvasSize = {
    canvasWidth: 1280,
    canvasHeight: 720,

    setSize: (width, height) => {
        CanvasSize.canvasWidth = width;
        CanvasSize.canvasHeight = height;
    },

    getSize: () => {
        return [CanvasSize.canvasWidth, CanvasSize.canvasHeight];
    }
}