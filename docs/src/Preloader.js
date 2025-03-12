export function loadImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";

    let images = new Map();

    images.set("Alert", p5.loadImage(basePath + "Alert.png"));
    images.set("leftarrow", p5.loadImage(basePath + "leftarrow.png"));
    images.set("rightarrow", p5.loadImage(basePath + "rightarrow.png"));
    images.set("panther", p5.loadImage(basePath + "panther.png"));

    images.set("Steppe", p5.loadImage(basePath + "Steppe.png"));
    images.set("PlayerBase", p5.loadImage(basePath + "PlayerBase.png"));
    images.set("Mountain", p5.loadImage(basePath + "Mountain.png"));
    images.set("Volcano", p5.loadImage(basePath + "Volcano.png"));
    images.set("Lava", p5.loadImage(basePath + "Lava.png"));
    images.set("LavaS", p5.loadImage(basePath + "LavaS.png"));
    images.set("Landslide", p5.loadImage(basePath + "Landslide.png"));
    images.set("Hill", p5.loadImage(basePath + "Hill.png"));

    images.set("Tree", p5.loadImage(basePath + "Tree.png"));
    images.set("Bush", p5.loadImage(basePath + "Bush.png"));
    images.set("Grass", p5.loadImage(basePath + "Grass.png"));
    images.set("Seed", p5.loadImage(basePath + "Seed.png"));
    images.set("FireHerb", p5.loadImage(basePath + "FireHerb.png"));
    images.set("Bamboo", p5.loadImage(basePath + "Bamboo.png"));

    images.set("Tornado", p5.loadImage(basePath + "Tornado.png"));
    images.set("alertArrow", p5.loadImage(basePath + "alertArrow.png"));
    images.set("Bandit", p5.loadImage(basePath + "Bandit.png"));
    images.set("Lumbering", p5.loadImage(basePath + "Lumbering.png"));
    images.set("Bomb", p5.loadImage(basePath + "Bomb.png"));
    images.set("GameMap", p5.loadImage(basePath + "GameMap.png"));
    return images;
}

export function loadSounds(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/sounds/" : "./assets/sounds/";

    let sounds = new Map();
    sounds.set("click", p5.loadSound(basePath + "click.mp3"));
    sounds.get("click").setVolume(0.5);
    return sounds;
}
