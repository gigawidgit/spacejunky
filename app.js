const t = (a, b, c) => {
  if (c) {
    document.querySelector(b || 'div').innerText = a
  }
  else {
    document.querySelector(b || 'div').innerText += a
  }
}
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let ships = [
  [
    [
      'cannon',
      'power',
      'support']],
  [
    'cockpit',
    [
      'cannon',
      'power',
      'booster'],
    'support'],
  [
    'booster',
    [
      'cannon',
      'power',
      'cockpit',
      'support'],
    'booster'],
  [
    [
      'cannon',
      'power',
      'support',
      'support'],
    'cannon'],
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
    'support',
    [
      'cannon',
      'power',
      'booster'],
    'cockpit',
    [
      'cannon',
      'power',
      'booster'],
    'support'],
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
      'stprage',
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
let components = [
  'cockpit',
  'power',
  'support',
  'booster',
  'cannon',
  'shield',
  'storage']
let colours = ['yellow', 'green', 'purple', 'orange', 'red', 'blue', 'cyan']
let mx = canvas.width / 2
let my = canvas.height / 2
canvas.height = 500
canvas.width = 500

function clear () {
  document.querySelector('div').innerText = ''
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const loadShip = (x) => {
  index = x || 0
  clear()
  t(ships[index].map(
    a => ((typeof(a) === 'object' && a.length) ? a.length : 1)).
    sort().
    reverse()[0] + ':' + ships[index].length)
  loopship(ships[index])
}

function loopship (ship, x, y) {
  for (var x = 0; x < ship.length; x++) {
    if (typeof(ship[x]) === 'object') {
      for (var y = 0; y < ship[x].length; y++) {
        if (ship[x][y]) {
          ctx.fillStyle = colours[components.indexOf(ship[x][y])]
          ctx.fillRect(15 + (x * 15), 15 + (y * 15), 10, 10)
        }
      }
    }
    else {
      ctx.fillStyle = colours[components.indexOf(ship[x])]
      ctx.fillRect(15 + (x * 15), 15 + (1 * 15), 10, 10)
    }
  }
}

document.querySelector('.next').addEventListener('click', () => {
  loadShip(((index < ships.length - 1) ? index + 1 : 0))
})
document.querySelector('.prev').addEventListener('click', () => {
  loadShip(((index >= 1) ? index - 1 : ships.length - 1))
})

loadShip()
