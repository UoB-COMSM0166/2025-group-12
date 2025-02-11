export function preloader(p5){
    let images = new Map(); // <String name, Image img>
    images.set("Tree", p5.loadImage("./docs/assets/images/Tree.jpg"));
    images.set("Bush", p5.loadImage("./docs/assets/images/Bush.jpg"));
    images.set("Grass", p5.loadImage("./docs/assets/images/Grass.jpg"));
    return images;
}
