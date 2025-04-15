function loadImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";

    let images = new Map();

    images.set("Alert", p5.loadImage(basePath + "Alert.png"));
    images.set("leftArrow", p5.loadImage(basePath + "leftArrow.png"));
    images.set("rightArrow", p5.loadImage(basePath + "rightArrow.png"));
    images.set("panther", p5.loadImage(basePath + "panther.png"));

    images.set("Steppe", p5.loadImage(basePath + "Steppe.png"));
    images.set("PlayerBase", p5.loadImage(basePath + "PlayerBase.png"));
    images.set("Mountain", p5.loadImage(basePath + "Mountain.png"));
    images.set("MountainLayer", p5.loadImage(basePath + "MountainLayer.png"));
    images.set("Lumbering", p5.loadImage(basePath + "Lumbering.png"));
    images.set("Volcano", p5.loadImage(basePath + "Volcano.png"));
    images.set("VolcanoLayer", p5.loadImage(basePath + "VolcanoLayer.png"));
    images.set("Lava", p5.loadImage(basePath + "LavaTest.png"));
    images.set("LavaS", p5.loadImage(basePath + "LavaSTest.png"));
    images.set("Landslide", p5.loadImage(basePath + "Landslide.png"));
    images.set("Hill", p5.loadImage(basePath + "Hill.png"));
    images.set("Snowfield", p5.loadImage(basePath + "Snowfield.png"));
    images.set("Sea", p5.loadImage(basePath + "Sea.png"));

    images.set("Pine", p5.loadImage(basePath + "Pine.png"));
    images.set("Corn", p5.loadImage(basePath + "Corn.png"));
    images.set("Orchid", p5.loadImage(basePath + "Orchid.png"));
    images.set("Seed", p5.loadImage(basePath + "Seed.png"));
    images.set("FireHerb", p5.loadImage(basePath + "FireHerb.png"));
    images.set("Bamboo", p5.loadImage(basePath + "Bamboo.png"));
    images.set("Plum", p5.loadImage(basePath + "Plum.png"));
    images.set("Kiku", p5.loadImage(basePath + "Kiku.png"));
    images.set("Palm", p5.loadImage(basePath + "Palm.png"));

    images.set("Tornado", p5.loadImage(basePath + "Tornado.png"));
    images.set("alertArrow", p5.loadImage(basePath + "alertArrow.png"));
    images.set("Bandit", p5.loadImage(basePath + "Bandit.png"));
    images.set("VolcanicBomb", p5.loadImage(basePath + "Bomb.png"));
    images.set("Blizzard", p5.loadImage(basePath + "Blizzard.png"));
    images.set("TsunamiAnimation", p5.loadImage(basePath + "Tsunami.png"));

    images.set("GameMapBG", p5.loadImage(basePath + "GameMapBG.png"));
    images.set("Lock", p5.loadImage(basePath + "Lock.png"));
    images.set("TornadoIcon", p5.loadImage(basePath + "TornadoIcon.png"));
    images.set("VolcanoIcon", p5.loadImage(basePath + "VolcanoIcon.png"));
    images.set("EarthquakeIcon", p5.loadImage(basePath + "EarthquakeIcon.png"));
    images.set("RainIcon", p5.loadImage(basePath + "RainIcon.png"));
    images.set("TsunamiIcon", p5.loadImage(basePath + "TsunamiIcon.png"));

    return images;
}

function loadSounds(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/sounds/" : "./assets/sounds/";

    let sounds = new Map();
    sounds.set("click", p5.loadSound(basePath + "click.mp3"));
    sounds.get("click").setVolume(0.5);
    return sounds;
}

export {loadImages, loadSounds};

if (typeof module !== 'undefined') {
    module.exports = {loadImages, loadSounds};
}