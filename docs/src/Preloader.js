export function preloader(p5) {
    const basePath =  window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";
    console.log(basePath);
    let images = new Map();
    images.set("Tree", p5.loadImage(basePath + "Tree.jpg"));
    images.set("Bush", p5.loadImage(basePath + "Bush.jpg"));
    images.set("Grass", p5.loadImage(basePath + "Grass.jpg"));
    images.set("Storm", p5.loadImage(basePath + "Storm.png"));
    images.set("Mob", p5.loadImage(basePath + "Mob.jpg"));

    return images;
}