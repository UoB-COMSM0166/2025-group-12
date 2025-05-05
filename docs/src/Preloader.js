function replacePromise(p5, images, path, key, promise) {
    return promise.then(() =>
        new Promise((resolve) => {
            p5.loadImage(path, (img) => {
                images.set(key, img);
                resolve();
            });
        })
    );
}

function loadEssentialImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";
    let images = new Map();

    images.set("TitleBackground", p5.loadImage(basePath + "TitleBackground.png"));
    images.set("TitleBanner", p5.loadImage(basePath + "TitleBanner.png"));
    images.set("GameMapBG1", p5.loadImage(basePath + "GameMapBG1.png"));
    images.set("Lock", p5.loadImage(basePath + "Lock.png"));
    images.set("TornadoIcon", p5.loadImage(basePath + "TornadoIcon.png"));
    images.set("VolcanoIcon", p5.loadImage(basePath + "VolcanoIcon.png"));
    images.set("EarthquakeIcon", p5.loadImage(basePath + "EarthquakeIcon.png"));
    images.set("RainIcon", p5.loadImage(basePath + "RainIcon.png"));
    images.set("TsunamiIcon", p5.loadImage(basePath + "TsunamiIcon.png"));

    return images;
}

async function loadImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";
    let images = p5.images;
    let promise = Promise.resolve();

    const entries = [
        ["Alert", "Alert.png"],
        ["baseBlock", "baseBlock.png"],
        ["Desert1", "Desert1.png"],
        ["Desert2", "Desert2.png"],
        ["PlayerBase", "PlayerBase.png"],
        ["Mountain", "Mountain.png"],
        ["Lumbering", "Lumbering.png"],
        ["Volcano", "Volcano.png"],
        ["VolcanoLayer", "VolcanoLayer.png"],
        ["Lava", "Lava.png"],
        ["LavaS", "LavaS.png"],
        ["Hill1", "Hill1.png"],
        ["Hill2", "Hill2.png"],
        ["Hill3", "Hill3.png"],
        ["Snowfield", "Snowfield.png"],
        ["Sea", "Sea.png"],
        ["Seed", "Seed.png"],
        ["Seed1", "Seed1.png"],
        ["Pine", "Pine.png"],
        ["Corn", "Corn.png"],
        ["Orchid", "Orchid.png"],
        ["Kiku", "Kiku.png"],
        ["Palm", "Palm.png"],
        ["Tornado", "Tornado.png"],
        ["alertArrow", "alertArrow.png"],
        ["Bandit", "Bandit.png"],
        ["VolcanicBomb", "Bomb.png"],
        ["Blizzard", "Blizzard.png"],
        ["TsunamiAnimation", "Tsunami.png"],
        ["GameMapBG2", "GameMapBG2.png"],
        ["GameMapBG3", "GameMapBG3.png"],
        ["TornadoBG", "TornadoBG.png"],
        ["VolcanoBG", "VolcanoBG.png"],
        ["EarthquakeBG", "EarthquakeBG.png"],
        ["BlizzardBG", "BlizzardBG.png"],
        ["TsunamiBG", "TsunamiBG.png"],
        ["xbox_A", "xbox/xbox_A.png"],
        ["xbox_B", "xbox/xbox_B.png"],
        ["xbox_X", "xbox/xbox_X.png"],
        ["xbox_Y", "xbox/xbox_Y.png"],
        ["xbox_up", "xbox/xbox_up.png"],
        ["xbox_down", "xbox/xbox_down.png"],
        ["xbox_left", "xbox/xbox_left.png"],
        ["xbox_right", "xbox/xbox_right.png"],
        ["xbox_menu", "xbox/xbox_menu.png"],
        ["xbox_view", "xbox/xbox_view.png"],
        ["xbox_LB", "xbox/xbox_LB.png"],
        ["xbox_LT", "xbox/xbox_LT.png"],
        ["xbox_RB", "xbox/xbox_RB.png"],
        ["xbox_RT", "xbox/xbox_RT.png"],
        ["xbox_cross", "xbox/xbox_cross.png"]
    ];

    for (const [key, file] of entries) {
        promise = replacePromise(p5, images, basePath + file, key, promise);
    }

    // LandslidePieces
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 2; j++) {
            const key = `Landslide${i}${j}`;
            const path = basePath + `LandslidePieces/${i}${j}.png`;
            promise = replacePromise(p5, images, path, key, promise);
        }
    }

    // FireHerb, Bamboo, Plum
    for (let i = 1; i <= 2; i++) {
        promise = replacePromise(p5, images, basePath + `FireHerb${i}.png`, `FireHerb${i}`, promise);
        promise = replacePromise(p5, images, basePath + `Bamboo${i}.png`, `Bamboo${i}`, promise);
        promise = replacePromise(p5, images, basePath + `Plum${i}.png`, `Plum${i}`, promise);
    }

    return promise;
}


function loadSounds(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/sounds/" : "./assets/sounds/";

    let sounds = new Map();
    sounds.set("click", p5.loadSound(basePath + "click.mp3"));
    sounds.get("click").setVolume(0.5);
    return sounds;
}

export {loadEssentialImages, loadImages, loadSounds};

if (typeof module !== 'undefined') {
    module.exports = {loadEssentialImages, loadImages, loadSounds};
}