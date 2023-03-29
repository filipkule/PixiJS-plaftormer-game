let app = new PIXI.Application({ width: 1280, height: 640 });
document.body.appendChild(app.view);

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
app.ticker.add(game)
app.stage.interactive = true
app.stage.on('pointermove', movePlayer)

const BOX_SIZE = 128

let inputStore = {}

let bottom = new PIXI.Graphics();
bottom.beginFill(0x89CFF0);
bottom.lineStyle(3, 0xcccccc, 1);
bottom.drawRect(0, 620,
    1280,
    50
);
bottom.endFill();
app.stage.addChild(bottom);

let player = PIXI.Sprite.from('player.png');
app.stage.addChild(player);
player.x = app.view.width - 500

let platform = new PIXI.Graphics();
platform.beginFill(0xffffff);
platform.lineStyle(3, 0xcccccc, 1);
platform.drawRect(525, 300,
    250,
    40
);
platform.endFill();

app.stage.addChild(platform);

//working

// const redSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
// redSquare.position.set(100, 100);
// redSquare.width = 100;
// redSquare.height = 100;
// redSquare.tint = 0xFF0000;
// redSquare.acceleration = new PIXI.Point(0);
// redSquare.mass = 1;
// redSquare.anchor.set(0.5)

// app.stage.addChild(redSquare);

function game() {
    if(collisionDetection(bottom, platform)) {
        app.stage.removeChild(platform) //TODO: here go through all the platforms and delete them 1 by one
    }
    if(collisionDetection(bottom, player)) {
        app.stage.removeChild(player) //TODO: game over, try again
    }
    if (collisionDetection(player, platform)) {
        debugger
    } else {
        player.y += 0.5
        processUserInput()
    }

}

function processUserInput() {
    if (inputStore["87"]) {//W
        player.y -= 100
        inputStore["87"] = false
    }

    if (inputStore["65"]) {//A
        player.x -= 5
        inputStore["65"] = false
    }

    if (inputStore["83"]) {//S
        player.y += 100
        inputStore["83"] = false
    }

    if (inputStore["68"]) {//D
        player.x += 5
        inputStore["68"] = false
    }
}

function collisionDetection(a, b) {
    let aBox = a.getBounds()
    let bBox = b.getBounds()
    return aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height
}

function movePlayer(e) {
    let pos = e.data.global

    redSquare.x = pos.x
    redSquare.y = pos.y
}

function keyDown(e) {
    console.log(e.keyCode)
    inputStore[e.keyCode] = true
}

function keyUp(e) {
    console.log(e.keyCode)
    inputStore[e.keyCode] = false
}