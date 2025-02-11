export function preloader(p5){
    export function preloader(p5) {
        const isGithubPages = window.location.hostname.includes("github.io");
        if(isGithubPages){
            console.log("github page");
        }

        const basePath = isGithubPages ? "./assets/images/" : "../assets/images/";

        let images = new Map();
        images.set("Tree", p5.loadImage(basePath + "Tree.jpg"));
        images.set("Bush", p5.loadImage(basePath + "Bush.jpg"));
        images.set("Grass", p5.loadImage(basePath + "Grass.jpg"));

        return images;
    }

}