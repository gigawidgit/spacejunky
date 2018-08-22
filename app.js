const t = (a, b, c) => (c)
  ? document.querySelector(b || 'div').innerText = a
  : document.querySelector(b || 'div').innerText += a
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let ships = [
  [
    [
      'cannon',
      'power',
      'support']],
  [
    [false,'cockpit'],
    [
      'cannon',
      'power',
      'booster'],
    [false,'support']],
  [
    [false,'booster'],
    [
      'cannon',
      'power',
      'cockpit',
      'support'],
    [false,'booster']],
  [
    [
      'cannon',
      'power',
      'support',
      'support'],
    [false, 'cannon']],
  [
    [
      false,
      'cannon',
      'support'],
    [
      'cockpit',
      'power',
      'power',
      'booster'],
    [
      false,
      'cannon',
      'support']],
  [
    [false, 'support'],
    [
      'cannon',
      'power',
      'booster'],
    [false, 'cockpit'],
    [
      'cannon',
      'power',
      'booster'],
    [false, 'support']],
  [
    [
      false,
      false,
      false,
      'cannon'],
    [
      false,
      false,
      'booster',
      'power',
      'booster'],
    [
      false,
      'booster',
      false,
      'support',
      false,
      'booster'],
    [
      'cannon',
      'power',
      'support',
      'cockpit',
      'support',
      'power',
      'booster'],
    [
      false,
      'booster',
      false,
      'support',
      false,
      'booster'],
    [
      false,
      false,
      'booster',
      'power',
      'booster'],
    [
      false,
      false,
      false,
      'cannon']],

  [
    [
      false,
      'storage',
      'storage',
      'storage',
      false,
      'booster'],
    [
      'power',
      'power',
      'power',
      'power',
      'power',
      'power',
      'cannon'],
    [
      false,
      'storage',
      'storage',
      'storage',
      false,
      'booster'],
    [
      false,
      'cockpit',
      'storage',
      'storage'],
    [
      false,
      'storage',
      'storage',
      'storage',
      false,
      'booster'],
    [
      'power',
      'power',
      'power',
      'power',
      'power',
      'power',
      'cannon'],
    [
      false,
      'storage',
      'storage',
      'storage',
      false,
      'booster']],

]
let index = 0
let parts = [
  'cockpit',
  'power',
  'support',
  'booster',
  'cannon',
  'shield',
  'storage']
let clrs = ['yellow', 'green', 'purple', 'orange', 'red', 'blue', 'cyan']
canvas.height = document.querySelector('span').clientHeight
canvas.width = document.querySelector('span').clientWidth
let mx = canvas.width / 2
let my = canvas.height / 2

function clear () {
  t('')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const loadShip = (x) => {
  index = x || 0
  clear()
  loop(ships[index])

}

const color = c => (parts.includes(c))
  ? ctx.fillStyle = clrs[parts.indexOf(c)]
  : false

const fill = (s, x, y, xl, yl, ship, list) => {
  let nx = mx - (xl * 15) / 2
  let ny = my - (yl * 15) / 2
  if (!color(s)) return
  ctx.fillRect(nx + 15 + (x * 15), ny + 15 + (y * 15), 10, 10)

  //Connectors
  if(typeof(ship[x][y+1]) ==='string'){
    ctx.fillStyle = 'teal'
    ctx.fillRect(nx + 15 + (x * 15), ny + 25 + (y * 15), 10, 5)
  }

  if(ship[x+1] && typeof(ship[x+1][y]) ==='string'){
    ctx.fillStyle = 'teal'
    ctx.fillRect(nx + 25 + (x * 15), ny + 15 + (y * 15), 5, 10)
  }

  //Top Bottom
  if(!ship[x][y+1]&& s ==='booster') {
    ctx.fillStyle = 'PaleGoldenRod'
    ctx.fillRect(nx + 15 + (x * 15), ny + 25 + (y * 15), 10, 15)
  }
  if(!ship[x][y-1]&& s ==='booster') {
    ctx.fillStyle = 'PaleGoldenRod'
    ctx.fillRect(nx + 15 + (x * 15), ny + 25 + (y * 15) -25, 10, 15)
  }

  // t(x+" "+y+" "+xl+" "+yl+"|")


      if(y === 0){
          if(!ship[x][y-1] && s ==='cannon') {
            ctx.fillStyle = 'pink'
            ctx.fillRect(nx + 15 + (x * 15), ny + 25 + (y * 15) -25, 10, 15)
            return
          }
      } else {
        if(list && y===list-1 && x && x!==xl-1) {
          if (!ship[x][y + 1] && s === 'cannon') {
            ctx.fillStyle = 'pink'
            ctx.fillRect(nx + 15 + (x * 15), ny + 25 + (y * 15), 10, 15)
            return
          }
        }
      }
      if(x ===0) {
        if ((!ship[x - 1] || !ship[x - 1][y]) && s === 'cannon') {
          ctx.fillStyle = 'pink'
          ctx.fillRect(nx + (x * 15), ny + 15 + (y * 15), 15, 10)
          return
        }
      }
      if(x===xl-1) {
        if ((!ship[x + 1] || !ship[x + 1][y]) && s === 'cannon') {
          ctx.fillStyle = 'pink'
          ctx.fillRect(nx + 25 + (x * 15), ny + 15 + (y * 15), 15, 10)
          return
        }
      }






  //Left Right

  if((!ship[x+1] || !ship[x+1][y]) && s ==='booster') {
    ctx.fillStyle = 'PaleGoldenRod'
    ctx.fillRect(nx + 25 + (x * 15), ny + 15 + (y * 15), 15, 10)
  }
  if((!ship[x-1]|| !ship[x-1][y] ) && s ==='booster') {
    ctx.fillStyle = 'PaleGoldenRod'
    ctx.fillRect(nx + (x * 15), ny + 15 + (y * 15), 15, 10)
  }



}
const loop = (ship) => {
  ship.forEach((a, x) => {
    if (typeof(a) === 'object') {
      a.forEach((b, y) => {
        fill(b, x, y, ship.length, 1, ship, a.length)
      })
    }
    else {
      fill(a, x, 1, ship.length, ship.length, ship, [1])
    }
  })
}

document.querySelector('.next').addEventListener('click', () => {
  loadShip(((index < ships.length - 1) ? index + 1 : 0))
})
document.querySelector('.prev').addEventListener('click', () => {
  loadShip(((index >= 1) ? index - 1 : ships.length - 1))
})

loadShip()
