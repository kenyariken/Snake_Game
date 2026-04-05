// 簡単なヘビゲーム（MakeCode JavaScript）
// 5x5 LED、向き:0=上,1=右,2=下,3=左

let snake: number[][] = [[2, 2]] // ヘビの体: [x,y] の配列、先頭が頭
let dir = 1                     // 向き：初期は右
let food: number[] = [0, 0]     // エサの座標
let score = 0
let gameOver = false

// ボタンA: 左回転、B: 右回転
input.onButtonPressed(Button.A, function () {
    dir = (dir + 3) % 4
})
input.onButtonPressed(Button.B, function () {
    dir = (dir + 1) % 4
})

// エサをランダムに置く（ヘビと重ならないようにする）
function spawnFood() {
    let tries = 0
    while (true) {
        food = [Math.randomRange(0, 4), Math.randomRange(0, 4)]
        let ok = true
        for (let p of snake) if (p[0] == food[0] && p[1] == food[1]) ok = false
        if (ok) break
        tries++
        if (tries > 50) break
    }
}

// 指定座標がヘビの体にぶつかるか（最後のしっぽを無視するオプション）
function hitsBody(x: number, y: number, ignoreTail: boolean) {
    for (let i = 0; i < snake.length; i++) {
        if (ignoreTail && i == snake.length - 1) continue
        if (snake[i][0] == x && snake[i][1] == y) return true
    }
    return false
}

// 初期化
spawnFood()
basic.clearScreen()
// ゲームループ
basic.forever(function () {
    if (gameOver) return
    // 次の頭の位置を計算
    let head = snake[0]
    let nx = head[0]
    let ny = head[1]
    if (dir == 0) ny -= 1
    else if (dir == 1) nx += 1
    else if (dir == 2) ny += 1
    else nx -= 1

    // 画面外チェック
    if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
        gameOver = true
    } else {
        // エサを食べるか
        let willGrow = (nx == food[0] && ny == food[1])
        // 自分の体に当たるか（成長するならしっぽもぶつかり判定に含める）
        if (hitsBody(nx, ny, !willGrow)) {
            gameOver = true
        } else {
            // 新しい頭を追加
            snake.unshift([nx, ny])
            if (willGrow) {
                score += 1
                spawnFood()
            } else {
                // しっぽを消して長さを保つ
                snake.pop()
            }
        }
    }

    // 画面描画
    basic.clearScreen()
    // エサ
    led.plot(food[0], food[1])
    // ヘビ（頭→体）の順で表示
    for (let p of snake) {
        led.plot(p[0], p[1])
    }

    // ゲームオーバー処理
    if (gameOver) {
        basic.clearScreen()
        basic.showString("Game")
        basic.showString("Over")
        basic.pause(200)
        basic.showNumber(score)
    }

    basic.pause(400) // 速度（ミリ秒）
}