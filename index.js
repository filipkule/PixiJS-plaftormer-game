let app = new PIXI.Application({ width: 1280, height: 640 })
document.body.appendChild(app.view)

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
app.ticker.add(game)
app.stage.interactive = true
app.stage.on('pointermove', movePlayer)

const BOX_SIZE = 128
const GRAVITY = 0.5

let inputStore = {}
let platforms = new Map()
let currentPlatform = null

let bottom = new PIXI.Graphics()
bottom.beginFill(0x89CFF0)
bottom.lineStyle(3, 0xcccccc, 1)
bottom.drawRect(0, 620,
    1280,
    50
)
bottom.endFill()
app.stage.addChild(bottom)

let player = PIXI.Sprite.from('player.png')
app.stage.addChild(player)
player.x = app.view.width - 700
player.currentGravity = GRAVITY

let start = new PIXI.Graphics()
start.beginFill(0xffffff)
start.lineStyle(3, 0xcccccc, 1)
start.drawRect(475, 500,
    250,
    40
)
start.endFill()

app.stage.addChild(start)
start.currentGravity = 0
start.collided = false
currentPlatform = start
platforms.set(0, start)



function game() {
    if (collisionDetection(bottom, player)) {
        app.stage.removeChild(player) //TODO: game over, try again
    }
    platforms.forEach(platform => {
        if (collisionDetection(player, platform)) {
            platform.currentGravity = GRAVITY
            currentPlatform = platform
            generatePlatformsOnCollision(platform.collided)
            platform.collided = true
        }
        platform.y += platform.currentGravity
        if (collisionDetection(bottom, platform)) {
            app.stage.removeChild(platform)
        }
    })

    player.y += player.currentGravity
    processUserInput()

}

function generatePlatformsOnCollision(collided) {
    if (!collided) {
        if (app.view.width / 2 > player.x) {
            createPlatform(player.x - 300, player.y - 300)
        } else {
            createPlatform(player.x + 300, player.y - 300)
        }
    }
}

function createPlatform(x, y) {
    //temp
    let newPlatform = new PIXI.Graphics()
    newPlatform.beginFill(0xffffff)
    newPlatform.lineStyle(3, 0xcccccc, 1)
    newPlatform.drawRect(x, y, 250, 40)
    newPlatform.endFill()
    app.stage.addChild(newPlatform)
    newPlatform.currentGravity = 0
    newPlatform.collided = false
    platforms.set(platforms.size, newPlatform)
}

function processUserInput() {
    if (inputStore["87"]) {//W
        player.y -= 150
        inputStore["87"] = false
        player.currentGravity = GRAVITY
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
}

function keyDown(e) {
    console.log(e.keyCode)
    inputStore[e.keyCode] = true
}

function keyUp(e) {
    console.log(e.keyCode)
    inputStore[e.keyCode] = false
}