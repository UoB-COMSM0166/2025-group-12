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
    images.set("TornadoIconDeactivate", p5.loadImage(basePath + "TornadoIconDeactivate.png"));
    images.set("VolcanoIconDeactivate", p5.loadImage(basePath + "VolcanoIconDeactivate.png"));
    images.set("EarthquakeIconDeactivate", p5.loadImage(basePath + "EarthquakeIconDeactivate.png"));
    images.set("RainIconDeactivate", p5.loadImage(basePath + "RainIconDeactivate.png"));
    images.set("TsunamiIconDeactivate", p5.loadImage(basePath + "TsunamiIconDeactivate.png"));
    images.set("TaskBoard", p5.loadImage(basePath + "TaskBoard.png"));
    for (let i = 1; i <= 4; i++) {
        for (let j = 0; j <= i; j++) {
            images.set(`TaskProgress${i}${j}`, p5.loadImage(basePath + "StageProgressBars/" + `${i}${j}.png`));
        }
    }
    for (let i = 1; i <= 2; i++) {
        images.set(`Button${i}`, p5.loadImage(basePath + `Button${i}.png`));
        images.set(`ButtonHover${i}`, p5.loadImage(basePath + `ButtonHover${i}.png`));
    }
    images.set("inv-top", p5.loadImage(basePath + "inv-top.png"));
    images.set("inv-body", p5.loadImage(basePath + "inv-body.png"));
    images.set("inv-bot", p5.loadImage(basePath + "inv-bot.png"));
    return images;
}

async function loadImages(p5) {
    const basePath = window.location.hostname.includes("localhost") ? "/docs/assets/images/" : "./assets/images/";
    let images = new Map();
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
        ["inv-Pine", "plants/Pine.png"],
        ["inv-PineSeed", "plants/PineSeed.png"],
        ["Corn", "Corn.png"],
        ["inv-Corn", "plants/Corn.png"],
        ["inv-CornSeed", "plants/CornSeed.png"],
        ["Orchid", "Orchid.png"],
        ["inv-Orchid", "plants/Orchid.png"],
        ["inv-OrchidSeed", "plants/OrchidSeed.png"],
        ["Kiku", "Kiku.png"],
        ["inv-Kiku", "plants/Kiku.png"],
        ["inv-KikuSeed", "plants/KikuSeed.png"],
        ["Palm", "Palm.png"],
        ["inv-Palm", "plants/Palm.png"],
        ["inv-PalmSeed", "plants/PalmSeed.png"],
        ["inv-Plum", "plants/Plum.png"],
        ["inv-PlumSeed", "plants/PlumSeed.png"],
        ["inv-Bamboo", "plants/Bamboo.png"],
        ["inv-BambooSeed", "plants/BambooSeed.png"],
        ["inv-FireHerb", "plants/FireHerb.png"],
        ["inv-FireHerbSeed", "plants/FireHerbSeed.png"],
        ["Tornado", "Tornado.png"],
        ["alertArrow", "alertArrow.png"],
        ["Bandit", "Bandit.png"],
        ["BanditIdle01", "Bandit/Idle/01.png"],
        ["BanditIdle02", "Bandit/Idle/02.png"],
        ["BanditIdle03", "Bandit/Idle/03.png"],
        ["BanditIdle04", "Bandit/Idle/04.png"],
        ["BanditIdle05", "Bandit/Idle/05.png"],
        ["BanditIdle06", "Bandit/Idle/06.png"],
        ["BanditIdle07", "Bandit/Idle/07.png"],
        ["BanditIdle08", "Bandit/Idle/08.png"],
        ["BanditIdle09", "Bandit/Idle/09.png"],
        ["BanditIdle10", "Bandit/Idle/10.png"],
        ["BanditIdle11", "Bandit/Idle/11.png"],
        ["BanditIdle12", "Bandit/Idle/12.png"],
        ["BanditWalking01", "Bandit/Walking/01.png"],
        ["BanditWalking02", "Bandit/Walking/02.png"],
        ["BanditWalking03", "Bandit/Walking/03.png"],
        ["BanditWalking04", "Bandit/Walking/04.png"],
        ["BanditWalking05", "Bandit/Walking/05.png"],
        ["BanditWalking06", "Bandit/Walking/06.png"],
        ["BanditWalking07", "Bandit/Walking/07.png"],
        ["BanditWalking08", "Bandit/Walking/08.png"],
        ["BanditWalking09", "Bandit/Walking/09.png"],
        ["BanditWalking10", "Bandit/Walking/10.png"],
        ["BanditWalking11", "Bandit/Walking/11.png"],
        ["BanditWalking12", "Bandit/Walking/12.png"],
        ["BanditWalking13", "Bandit/Walking/13.png"],
        ["BanditWalking14", "Bandit/Walking/14.png"],
        ["BanditWalking15", "Bandit/Walking/15.png"],
        ["BanditWalking16", "Bandit/Walking/16.png"],
        ["BanditWalking17", "Bandit/Walking/17.png"],
        ["BanditWalking18", "Bandit/Walking/18.png"],
        ["BanditAttacking01", "Bandit/Attacking/01.png"],
        ["BanditAttacking02", "Bandit/Attacking/02.png"],
        ["BanditAttacking03", "Bandit/Attacking/03.png"],
        ["BanditAttacking04", "Bandit/Attacking/04.png"],
        ["BanditAttacking05", "Bandit/Attacking/05.png"],
        ["BanditAttacking06", "Bandit/Attacking/06.png"],
        ["BanditAttacking07", "Bandit/Attacking/07.png"],
        ["BanditAttacking08", "Bandit/Attacking/08.png"],
        ["BanditAttacking09", "Bandit/Attacking/09.png"],
        ["BanditAttacking10", "Bandit/Attacking/10.png"],
        ["BanditAttacking11", "Bandit/Attacking/11.png"],
        ["BanditHurt01", "Bandit/Hurt/01.png"],
        ["BanditHurt02", "Bandit/Hurt/02.png"],
        ["BanditHurt03", "Bandit/Hurt/03.png"],
        ["BanditHurt04", "Bandit/Hurt/04.png"],
        ["BanditHurt05", "Bandit/Hurt/05.png"],
        ["BanditHurt06", "Bandit/Hurt/06.png"],
        ["BanditHurt07", "Bandit/Hurt/07.png"],
        ["BanditHurt08", "Bandit/Hurt/08.png"],
        ["BanditHurt09", "Bandit/Hurt/09.png"],
        ["BanditHurt10", "Bandit/Hurt/10.png"],
        ["BanditHurt11", "Bandit/Hurt/11.png"],
        ["BanditHurt12", "Bandit/Hurt/12.png"],
        ["BanditDying01", "Bandit/Dying/01.png"],
        ["BanditDying02", "Bandit/Dying/02.png"],
        ["BanditDying03", "Bandit/Dying/03.png"],
        ["BanditDying04", "Bandit/Dying/04.png"],
        ["BanditDying05", "Bandit/Dying/05.png"],
        ["BanditDying06", "Bandit/Dying/06.png"],
        ["BanditDying07", "Bandit/Dying/07.png"],
        ["BanditDying08", "Bandit/Dying/08.png"],
        ["BanditDying09", "Bandit/Dying/09.png"],
        ["BanditDying10", "Bandit/Dying/10.png"],
        ["BanditDying11", "Bandit/Dying/11.png"],
        ["BanditDying12", "Bandit/Dying/12.png"],
        ["BanditDying13", "Bandit/Dying/13.png"],
        ["BanditDying14", "Bandit/Dying/14.png"],
        ["BanditDying15", "Bandit/Dying/15.png"],
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
        ["xbox_cross", "xbox/xbox_cross.png"],
        ["ActionPointBoard", "ActionPointBoard.png"],
        ["ActionPointBoardDeplete", "ActionPointBoardDeplete.png"],
        ["infobox", "infobox.png"],
        ["infobox-inner", "infobox-inner.png"],
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

    // level signs
    for (let i = 1; i <= 5; i++) {
        let jMax;
        switch (i) {
            case 1:
                jMax = 4;
                break;
            case 2:
                jMax = 1;
                break;
            case 3:
                jMax = 3;
                break;
            case 4:
                jMax = 2;
                break;
            case 5:
                jMax = 1;
                break;
        }
        for (let j = 1; j <= jMax; j++) {
            const key = `LevelSigns${i}-${j}`;
            const path = basePath + `LevelSigns/lv${i}-${j}.png`;
            promise = replacePromise(p5, images, path, key, promise);
        }
    }

    // FireHerb, Bamboo, Plum
    for (let i = 1; i <= 2; i++) {
        promise = replacePromise(p5, images, basePath + `FireHerb${i}.png`, `FireHerb${i}`, promise);
        promise = replacePromise(p5, images, basePath + `Bamboo${i}.png`, `Bamboo${i}`, promise);
        promise = replacePromise(p5, images, basePath + `Plum${i}.png`, `Plum${i}`, promise);
    }

    return promise.then(() => images);
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