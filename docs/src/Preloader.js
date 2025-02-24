export function preloader(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";

    let images = new Map();

    images.set("leftarrow", p5.loadImage(basePath + "leftarrow.png"));
    images.set("rightarrow", p5.loadImage(basePath + "rightarrow.png"));
    images.set("ground", p5.loadImage(basePath + "ground.png"));
    images.set("panther", p5.loadImage(basePath + "panther.png"));

    images.set("Steppe", p5.loadImage(basePath + "Steppe.png"));
    images.set("PlayerBase", p5.loadImage(basePath + "PlayerBase.png"));
    images.set("Mountain", p5.loadImage(basePath + "Mountain.png"));

    images.set("Tree", p5.loadImage(basePath + "Tree.png"));
    images.set("Bush", p5.loadImage(basePath + "Bush.png"));
    images.set("Grass", p5.loadImage(basePath + "Grass.png"));

    images.set("Seed", p5.loadImage(basePath + "Seed.png"));

    images.set("Tornado", p5.loadImage(basePath + "Tornado.png"));
    images.set("Mob", p5.loadImage(basePath + "Mob.jpg"));
    images.set("Bandit", p5.loadImage(basePath + "Bandit.png"));

    return images;
}
