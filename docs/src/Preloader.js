export function preloader(p5) {
    const basePath =  window.location.hostname.includes("github.io") ? "./assets/images/" : "../assets/images/";

    let images = new Map();

    images.set("leftarrow", p5.loadImage(basePath + "leftarrow.png"));
    images.set("rightarrow", p5.loadImage(basePath + "rightarrow.png"));
    images.set("ground", p5.loadImage(basePath + "ground.png"));

    images.set("Tree", p5.loadImage(basePath + "Tree.png"));
    images.set("Bush", p5.loadImage(basePath + "Bush.png"));
    images.set("Grass", p5.loadImage(basePath + "Grass.png"));

    images.set("Storm", p5.loadImage(basePath + "Storm.png"));
    images.set("Mob", p5.loadImage(basePath + "Mob.jpg"));

    return images;
}