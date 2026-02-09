namespace SpriteKind {
    export const Chaser = SpriteKind.create()
    export const Collectible = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectible, function (player3, dot) {
    dot.destroy()
    info.changeScoreBy(5)
    // reward: reduce slow a little
    slowAmount += 0 - 8
    if (slowAmount < 0) {
        slowAmount = 0
    }
})
// MOVEMENT
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    player2.vy = 0 - baseMoveSpeed + slowAmount
    controller.moveSprite(player2)
})
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    player2.vy = 0
})
// HIT = SLOW DOWN
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player3, obs) {
    obs.destroy()
    slowAmount += 12
    if (slowAmount > 60) {
        slowAmount = 60
    }
    scene.cameraShake(4, 200)
})
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    player2.vy = 0
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    player2.vy = baseMoveSpeed - slowAmount
})
let dot: Sprite = null
let obs: Sprite = null
let sizeType = 0
let slowAmount = 0
let player2: Sprite = null
let baseMoveSpeed = 0
music.play(music.stringPlayable("C A B C G A C C5 ", 120), music.PlaybackMode.LoopingInBackground)
let chaser: Sprite = null
let obstacleSpeed = -80
baseMoveSpeed = 100
scene.setBackgroundImage(assets.image`ocean scene`)
// PLAYER
player2 = sprites.create(assets.image`little chody`, SpriteKind.Player)
player2.setPosition(40, 60)
player2.setStayInScreen(true)
player2.scale = 0.6
// ───────── CHASER ─────────
chaser = sprites.create(assets.image`boi`, SpriteKind.Chaser)
chaser.setPosition(5, 60)
chaser.scale = 1
chaser.follow(player2, 20)
animation.runImageAnimation(
chaser,
assets.animation`big dog`,
500,
true
)
game.onUpdate(function () {
    // follow vertically
    chaser.y += (player2.y - chaser.y) * 0.06
    if (slowAmount > 0) {
        // slowed = chaser gains
        chaser.x += 0.35 + slowAmount * 0.01
    } else {
        chaser.x -= 0.2
    }
    // don't let chaser go too far off-screen
    if (chaser.x < -10) {
        chaser.x = -10
    }
    // KILL CHECK (distance based)
    if (Math.abs(chaser.x - player2.x) < 10 && Math.abs(chaser.y - player2.y) < 12) {
        game.over(false, effects.splatter)
    }
})
// ───────── OBSTACLES ─────────
game.onUpdateInterval(700, function () {
    sizeType = randint(0, 2)
    obs = sprites.create(assets.image`boi 2`, SpriteKind.Enemy)
    obs.setPosition(160, randint(15, 105))
    obs.vx = obstacleSpeed
})
// ───────── COLLECTIBLE DOTS ─────────
game.onUpdateInterval(1000, function () {
    dot = sprites.create(img`
        . . . . . . . e e e e . . . . . 
        . . . . . e e 4 5 5 5 e e . . . 
        . . . . e 4 5 6 2 2 7 6 6 e . . 
        . . . e 5 6 6 7 2 2 6 4 4 4 e . 
        . . e 5 2 2 7 6 6 4 5 5 5 5 4 . 
        . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4 
        . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4 
        e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4 
        e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4 
        e 5 c c e 5 4 5 5 5 4 5 5 5 e . 
        e 5 c c 5 5 5 5 5 5 5 5 4 e . . 
        e 5 e c 5 4 5 4 5 5 5 e e . . . 
        e 5 e e 5 5 5 5 5 4 e . . . . . 
        4 5 4 e 5 5 5 5 e e . . . . . . 
        . 4 5 4 5 5 4 e . . . . . . . . 
        . . 4 4 e e e . . . . . . . . . 
        `, SpriteKind.Collectible)
    dot.setPosition(160, randint(15, 105))
    dot.vx = obstacleSpeed
    dot.scale = 0.5
})
// SCORE OVER TIME
game.onUpdateInterval(1000, function () {
    info.changeScoreBy(1)
    game.setGameOverScoringType(game.ScoringType.HighScore)
})
// RECOVER SLOW OVER TIME
game.onUpdateInterval(1200, function () {
    slowAmount += 0 - 4
    if (slowAmount < 0) {
        slowAmount = 0
    }
})
