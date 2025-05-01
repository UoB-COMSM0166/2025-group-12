function loadImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";

    let images = new Map();

    images.set("Alert", p5.loadImage(basePath + "Alert.png"));
    images.set("panther", p5.loadImage(basePath + "panther.png"));

    images.set("baseBlock", p5.loadImage(basePath + "baseBlock.png"));
    images.set("Desert1", p5.loadImage(basePath + "Desert1.png"));
    images.set("Desert2", p5.loadImage(basePath + "Desert2.png"));
    images.set("PlayerBase", p5.loadImage(basePath + "PlayerBase.png"));
    images.set("Mountain", p5.loadImage(basePath + "Mountain.png"));
    images.set("Lumbering", p5.loadImage(basePath + "Lumbering.png"));
    images.set("Volcano", p5.loadImage(basePath + "Volcano.png"));
    images.set("VolcanoLayer", p5.loadImage(basePath + "VolcanoLayer.png"));
    images.set("Lava", p5.loadImage(basePath + "Lava.png"));
    images.set("LavaS", p5.loadImage(basePath + "LavaS.png"));
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 2; j++) {
            images.set("Landslide" + i.toString() + j.toString(), p5.loadImage(basePath + "LandslidePieces/" + i.toString() + j.toString() + ".png"));
        }
    }
    images.set("Hill1", p5.loadImage(basePath + "Hill1.png"));
    images.set("Hill2", p5.loadImage(basePath + "Hill2.png"));
    images.set("Hill3", p5.loadImage(basePath + "Hill3.png"));
    images.set("Snowfield", p5.loadImage(basePath + "Snowfield.png"));
    images.set("Sea", p5.loadImage(basePath + "Sea.png"));

    images.set("Seed", p5.loadImage(basePath + "Seed.png"));
    images.set("Pine", p5.loadImage(basePath + "Pine.png"));
    images.set("Corn", p5.loadImage(basePath + "Corn.png"));
    images.set("Orchid", p5.loadImage(basePath + "Orchid.png"));
    images.set("Kiku", p5.loadImage(basePath + "Kiku.png"));
    images.set("Palm", p5.loadImage(basePath + "Palm.png"));
    for (let i = 1; i <= 2; i++) {
        images.set("FireHerb" + i.toString(), p5.loadImage(basePath + "FireHerb" + i.toString() + ".png"));
    }
    for (let i = 1; i <= 2; i++) {
        images.set("Bamboo" + i.toString(), p5.loadImage(basePath + "Bamboo" + i.toString() + ".png"));
    }
    for (let i = 1; i <= 2; i++) {
        images.set("Plum" + i.toString(), p5.loadImage(basePath + "Plum" + i.toString() + ".png"));
    }

    images.set("Tornado", p5.loadImage(basePath + "Tornado.png"));
    images.set("alertArrow", p5.loadImage(basePath + "alertArrow.png"));
    images.set("Bandit", p5.loadImage(basePath + "Bandit.png"));
    images.set("VolcanicBomb", p5.loadImage(basePath + "Bomb.png"));
    images.set("Blizzard", p5.loadImage(basePath + "Blizzard.png"));
    images.set("TsunamiAnimation", p5.loadImage(basePath + "Tsunami.png"));

    images.set("GameMapBG1", p5.loadImage(basePath + "GameMapBG1.png"));
    images.set("GameMapBG2", p5.loadImage(basePath + "GameMapBG2.png"));
    images.set("GameMapBG3", p5.loadImage(basePath + "GameMapBG3.png"));
    images.set("Lock", p5.loadImage(basePath + "Lock.png"));
    images.set("TornadoIcon", p5.loadImage(basePath + "TornadoIcon.png"));
    images.set("VolcanoIcon", p5.loadImage(basePath + "VolcanoIcon.png"));
    images.set("EarthquakeIcon", p5.loadImage(basePath + "EarthquakeIcon.png"));
    images.set("RainIcon", p5.loadImage(basePath + "RainIcon.png"));
    images.set("TsunamiIcon", p5.loadImage(basePath + "TsunamiIcon.png"));

    images.set("TitleBackground", p5.loadImage(basePath + "TitleBackground.png"));
    images.set("TitleBanner", p5.loadImage(basePath + "TitleBanner.png"));

    images.set("TornadoBG", p5.loadImage(basePath + "TornadoBG.png"));
    images.set("VolcanoBG", p5.loadImage(basePath + "VolcanoBG.png"));
    images.set("EarthquakeBG", p5.loadImage(basePath + "EarthquakeBG.png"));
    images.set("BlizzardBG", p5.loadImage(basePath + "BlizzardBG.png"));
    images.set("TsunamiBG", p5.loadImage(basePath + "TsunamiBG.png"));

    images.set("xbox_A", p5.loadImage(basePath + "xbox/" + "xbox_A.png"));
    images.set("xbox_B", p5.loadImage(basePath + "xbox/" + "xbox_B.png"));
    images.set("xbox_X", p5.loadImage(basePath + "xbox/" + "xbox_X.png"));
    images.set("xbox_Y", p5.loadImage(basePath + "xbox/" + "xbox_Y.png"));
    images.set("xbox_up", p5.loadImage(basePath + "xbox/" + "xbox_up.png"));
    images.set("xbox_down", p5.loadImage(basePath + "xbox/" + "xbox_down.png"));
    images.set("xbox_left", p5.loadImage(basePath + "xbox/" + "xbox_left.png"));
    images.set("xbox_right", p5.loadImage(basePath + "xbox/" + "xbox_right.png"));
    images.set("xbox_menu", p5.loadImage(basePath + "xbox/" + "xbox_menu.png"));
    images.set("xbox_view", p5.loadImage(basePath + "xbox/" + "xbox_view.png"));
    images.set("xbox_LB", p5.loadImage(basePath + "xbox/" + "xbox_LB.png"));
    images.set("xbox_LT", p5.loadImage(basePath + "xbox/" + "xbox_LT.png"));
    images.set("xbox_RB", p5.loadImage(basePath + "xbox/" + "xbox_RB.png"));
    images.set("xbox_RT", p5.loadImage(basePath + "xbox/" + "xbox_RT.png"));
    images.set("xbox_cross", p5.loadImage(basePath + "xbox/" + "xbox_cross.png"));

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