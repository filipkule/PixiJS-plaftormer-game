let app = new PIXI.Application({ width: 1280, height: 640 })
document.body.appendChild(app.view)

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
app.ticker.add(game)
app.stage.interactive = true
app.stage.on('pointermove', movePlayer)

const BOX_SIZE = 128
const GRAVITY = 0.3
const PLAYER_GRAVITY = 0.5
const PLATFORM_DISTANCE = 150
const START_POSITION = { x: 475, y: 500 }

let score = -1

let inputStore = {}
let platforms = new Map()
let currentPlatform = null
let platformsGravity = 0
let playerGrounded = false

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
player.y = app.view.height - 300
player.currentGravity = PLAYER_GRAVITY

initialPlatforms()

function game() {
    player.y += player.currentGravity
    if (collisionDetection(bottom, player)) {
        app.stage.removeChild(player) //TODO: game over, try again
    }
    platforms.forEach(platform => {
        if (collisionDetection(player, platform)) {
            platformsGravity = GRAVITY
            currentPlatform = platform
            generatePlatformsOnCollision(platform.collided)
            platform.collided = true
            player.currentGravity = GRAVITY
            playerGrounded = true
            score++
        }
        platform.y += platformsGravity

        if (collisionDetection(bottom, platform)) {
            app.stage.removeChild(platform)//TODO: splice platforms
            platforms.delete(platform.id)
            console.log('platform size', platforms)
        }
    })
    processUserInput()

}

function generatePlatformsOnCollision(collided) {
    if (!collided) {
        if (score % 2 == 0) {
            createPlatform(app.view.width / 2 - 150, -100)// TODO: This is just a POC. Make the platforms not dependable on player at all.
        } else {
            createPlatform(app.view.width / 2 + 150, -100)
        }
    }
}

function createPlatform(x, y) {
    let newPlatform = new PIXI.Graphics()
    newPlatform.beginFill(0xffffff)
    newPlatform.lineStyle(3, 0xcccccc, 1)
    newPlatform.drawRect(x, y, 250, 15)
    newPlatform.endFill()
    app.stage.addChild(newPlatform)
    newPlatform.currentGravity = GRAVITY
    newPlatform.collided = false
    newPlatform.id = Math.random() * 10000
    platforms.set(newPlatform.id, newPlatform)
}

function initialPlatforms() {
    let start = new PIXI.Graphics()
    start.beginFill(0xffffff)
    start.lineStyle(3, 0xcccccc, 1)
    start.drawRect(START_POSITION.x, START_POSITION.y, 250, 15)
    start.endFill()
    app.stage.addChild(start)
    start.currentGravity = 0
    start.collided = false
    currentPlatform = start
    platforms.set(0, start)

    for (let i = 1; i < 4; i++) {
        if (i % 2 == 0) {
            createPlatform(START_POSITION.x + 150, START_POSITION.y - i * PLATFORM_DISTANCE)
        } else {
            createPlatform(START_POSITION.x - 150, START_POSITION.y - i * PLATFORM_DISTANCE)
        }
    }
}

function processUserInput() {
    if (inputStore["87"] && playerGrounded) {//W
        player.currentGravity = PLAYER_GRAVITY
        player.y -= 170
        inputStore["87"] = false
        processLeftOrRightInput()
        playerGrounded = false
    }

    if (inputStore["83"]) {//S
        player.y += 30
        inputStore["83"] = false
        processLeftOrRightInput()
    }

    processLeftOrRightInput()
}

function processLeftOrRightInput() {
    if (inputStore["65"]) {//A
        player.x -= 6
    }

    if (inputStore["68"]) {//D
        player.x += 6
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
    inputStore[e.keyCode] = true
}

function keyUp(e) {
    inputStore[e.keyCode] = false
}