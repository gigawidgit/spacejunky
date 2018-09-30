let camera, scene, renderer
let mesh
let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight -
  document.querySelector('.main').clientHeight
let screensplit = 1
let group = new THREE.Group()
let modifier = new THREE.SubdivisionModifier(1.2)
let toggle
let ships = [
  [
    [
      'cannon',
      'power',
      'support']],
  [
    [false, 'cockpit'],
    [
      'cannon',
      'power',
      'booster'],
    [false, 'support']],
  [
    [false, 'booster'],
    [
      'cannon',
      'power',
      'cockpit',
      'support'],
    [false, 'booster']],
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
let index = 5
let parts = {
  'cockpit': {color: 0xFFFF00},
  'power': {color: 0x00FF0},
  'support': {color: 0xFF00FF},
  'booster': {color: 0x3333FF},
  'cannon': {color: 0xFF0000},
  'shield': {color: 0x0000FF},
  'storage': {color: 0xFF3311},
}
let clock = new THREE.Clock()
let pivot = new THREE.Object3D()
let ship = ships[index]
let material = new THREE.MeshPhongMaterial({color: 0xFFFFFF})
let thrust = 0
let turn = 0
let keys = {
  w:false,s:false,a:false,d:false,z:false
}

function clearship () {
  for (let i = pivot.children.length - 1; i >= 0; i--) {
    pivot.remove(pivot.children[i])
  }
  for (let i = group.children.length - 1; i >= 0; i--) {
    group.remove(group.children[i])
  }
}

const color = c => parts[c].color || false

// Camera
camera = new THREE.PerspectiveCamera(45, screensplit * SCREEN_WIDTH /
  SCREEN_HEIGHT, 1, 10000)

scene = new THREE.Scene()



// Lights
let alight = new THREE.AmbientLight(0xCCCCCC) // soft white light
alight.position.set(0, 0, 1)
alight.intensity = 0.3
scene.add(alight)

let dlight = new THREE.DirectionalLight(0xFFFFFF)
dlight.position.set(0, 50, 200)
dlight.intensity = 0.8
dlight.shadowMapWidth = 2048
dlight.shadowMapHeight = 2048
dlight.castShadow = true
scene.add(dlight)

//Distant Stars
let stars = new THREE.Group()
for (var i = 0; i < 10000; i++) {
  let pbox = new THREE.BoxGeometry(1, 1, 1)
  let mbox = new THREE.Mesh(pbox, material)
  mbox.position.x = Math.random() * 10000 - 1000
  mbox.position.y = Math.random() * 10000 - 1000
  mbox.position.z = Math.random() * 100 - 1000
  stars.add(mbox)
}
scene.add(stars)

//Shootable Stars
let cubes = new THREE.Group()
for (var i = 0; i < 10000; i++) {
  let pbox = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  let mbox = new THREE.Mesh(pbox, material)
  mbox.position.x = Math.random() * 10000 - 1000
  mbox.position.y = Math.random() * 10000 - 1000
  mbox.position.z = 0
  cubes.add(mbox)
}
scene.add(cubes)

function init () {
  loop()
  temp = new THREE.Box3().setFromObject(group)
  group.position.set(-(Math.abs(temp.max.x + temp.min.x) / 2),
    -(Math.abs(temp.max.y + temp.min.y) / 2), 0)
  pivot.add(group)
  scene.add(pivot)

}

const loop = (ls, x) => {
  x = x || 0
  ls = ls || ship
  ls.forEach((a, y) => {
    if (typeof(a) === 'object') {
      loop(a, y)
    }
    else {
      if (typeof(a) === 'string') {
        group.add(makeBox(x * 1.1, y * 1.1, color(a)))
        if (ship[x + 1] && typeof(ship[x + 1][y]) === 'string') {
          group.add(
            makeBox((x * 1.1) + 0.3, y * 1.1, 'white', 0.3, 1.2, 1, true, true))
        }
        if (ship[x][y] && typeof(ship[x][y + 1]) === 'string') {
          group.add(
            makeBox(x * 1.1, (y * 1.1) + 0.3, 'white', 0.3, 1.2, 1, true))
        }
      }

    }
  })

}

function makeBox (x, y, c, w, h, d, m, r) {
  let cyl = (!m)
    ? new THREE.BoxGeometry(w || 1, h || 1, 1, 2, 2, 2)
    : new THREE.CylinderGeometry(w || 1, w || 1, h || 1)
  let cyl_m = new THREE.MeshPhongMaterial({color: c})
  let smooth = (!m) ? modifier.modify(cyl) : cyl

  let mesh = new THREE.Mesh(smooth, cyl_m)
  mesh.castShadow = true
  mesh.receiveShadow = true
  if (r) {
    mesh.rotation.z = Math.PI / 2
  }

  mesh.position.set(x || 0, y || 0, 0)
  return mesh
}

let delta
let moveDistance
let rotateAngle

function update () {
  delta = clock.getDelta() // seconds.
  moveDistance = 100 * delta // 200 pixels per second
  rotateAngle = Math.PI / 2 * delta   // pi/2 radians (90 degrees) per second
  console.log(delta, thrust)
  if (keys['s'] && thrust < 10) thrust += delta
  if (keys['w'] && thrust > -10) thrust -= delta
  pivot.translateY(-moveDistance*thrust)
  if (keys['a']) pivot.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateAngle)
  if (keys['d']) pivot.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotateAngle)
  if (keys['z']) {
    pivot.position.set(0, 75, 0);
    pivot.rotation.set(0, 0, 0);
    thrust = 0
  }

  camera.lookAt(pivot.position)
}

//Renderer
const render = () => renderer.render(scene, camera)

renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight -
  document.querySelector('.main').clientHeight)
camera.position.set(0, 0, 75)
document.body.appendChild(renderer.domElement)

pivot.add(camera)

let controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableRotate = false
controls.enablePan = false
controls.enableKeys = true
controls.update()

//Animation
function animate () {
  requestAnimationFrame(animate)
  controls.update()
  render()
  update()
}

init()
animate()

//Event Listeners
document.querySelector('.build').addEventListener('click', () => {
  ship = JSON.parse(JSON.stringify(document.querySelector('.inputs').
    value.
    split('|').
    map(a => a.split(',').map(b => ((!b.length) ? false : b.trim())))))
  init(ship)
})

window.addEventListener('resize', onWindowResize, false)

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// let playerVector = new THREE.Vector3()

// window.addEventListener('keydown', (e) => {
//   if (e.key === 'ArrowRight') {
//     if (turn > -0.2) {
//       turn += -0.015
//     }
//   }
//   if (e.key === 'ArrowLeft') {
//     if (turn < 0.2) {
//       turn += 0.015
//     }
//
//   }
//   if (e.key === 'ArrowDown') {
//     if (thrust > -0.95) {
//       thrust += -0.1
//     }
//   }
//   if (e.key === 'ArrowUp') {
//     if (thrust < 0.95) {
//       thrust += 0.1
//     }
//   }
//
// })

// window.addEventListener('keyup', (e) => {
//   if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
//     turn = 0;
//   }
// })


window.addEventListener('keydown', (keyboard) => keys[keyboard.key] = true)
window.addEventListener('keyup', (keyboard) => keys[keyboard.key] = false)

