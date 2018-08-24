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
let index = 6
let parts = {
  'cockpit': {color: 0xFFFF00},
  'power': {color: 0x00FF0},
  'support': {color: 0xFF00FF},
  'booster': {color: 0x3333FF},
  'cannon': {color: 0xFF0000},
  'shield': {color: 0x0000FF},
  'storage': {color: 0xFF3311},
}
let clock = new THREE.Clock();
let pivot = new THREE.Object3D();
let spin = true
let ship = ships[index]
let rotate


camera = new THREE.PerspectiveCamera(30, screensplit * SCREEN_WIDTH /
  SCREEN_HEIGHT, 0.1, 10000)
camera.position.z = 100
scene = new THREE.Scene()

let alight = new THREE.AmbientLight(0xCCCCCC) // soft white light
alight.position.set(0, 0, 1)
alight.intensity = 0.5

scene.add(alight)

let dlight = new THREE.DirectionalLight(0xFFFFFF)
dlight.position.set(0, 20, 20)
dlight.intensity = 0.6
dlight.shadowMapWidth = 2048
dlight.shadowMapHeight = 2048
dlight.castShadow = true
scene.add(dlight)

renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight - document.querySelector('.main').clientHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)
window.addEventListener('resize', onWindowResize, false)



mixer = new THREE.AnimationMixer( scene );




function init (shipit) {
  ship = shipit || ships[index]
  for (let i = pivot.children.length - 1; i >= 0; i--) {
    pivot.remove(pivot.children[i])
  }
  for (let i = group.children.length - 1; i >= 0; i--) {
    group.remove(group.children[i])
  }
  loop();
  scene.add(group);
  temp = new THREE.Box3().setFromObject( group );
  group.position.set(-(Math.abs(temp.max.x+temp.min.x)/2),-(Math.abs(temp.max.y+temp.min.y)/2), 0)
  pivot.add(group)
  scene.add(pivot)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
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
  if (r) mesh.rotation.z = Math.PI / 2

  mesh.position.set(x || 0, y || 0, 0)
  return mesh
}

const color = c => parts[c].color || false

const loop = (ls, x) => {
  x = x || 0
  ls = ls || ship
  ls.forEach((a, y) => {
    if (typeof(a) === 'object') {
      loop(a, y)
    }
    else {
      if (typeof(a) === 'string') {
        group.add(makeBox(x*1.1, y*1.1, color(a)))
        if (ship[x + 1] && typeof(ship[x + 1][y]) === 'string') {
          group.add(
            makeBox((x*1.1) + 0.3, y*1.1, 'white', 0.3, 1.2, 1, true, true))
        }
        if (ship[x][y] && typeof(ship[x][y + 1]) === 'string') {
          group.add(makeBox(x*1.1, (y*1.1) + 0.3, 'white', 0.3, 1.2, 1, true))
        }
      }

    }
  })


}
init()
animate()


function render() {
  let delta = 0.75 * clock.getDelta();
    if(rotate === 'left') {
      pivot.rotation.z += 0.04
    }
    if(rotate === 'right'){
      pivot.rotation.z -= 0.04
    }

  mixer.update( delta );
  renderer.render( scene, camera );
}



window.addEventListener('keydown',(a)=>{
  if(a.key==='ArrowLeft'){
      rotate = 'left'
  }
  if(a.key==='ArrowRight'){
    rotate = 'right'
  }

})
window.addEventListener('keyup',(a)=> {
rotate = false
})


// document.querySelector('.next').addEventListener('click', () => {
//   index = (index < ships.length - 1) ? index + 1 : 0
//   init()
// })
// document.querySelector('.prev').addEventListener('click', () => {
//   index = (index >= 1) ? index - 1 : ships.length - 1
//   init()
// })
// document.querySelector('.build').addEventListener('click', () => {
//   ship = JSON.parse(JSON.stringify(document.querySelector('.inputs').
//     value.
//     split('|').
//     map(a => a.split(',').map(b => ((!b.length) ? false : b.trim())))))
//   init(ship)
// })
// document.querySelector('.animate').addEventListener('click', () => {
//   spin = !spin
// })