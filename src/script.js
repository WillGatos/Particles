import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending, PlaneGeometry } from 'three'

const loader = new THREE.TextureLoader();
const cross = loader.load("/Vector 101.png")

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.RingGeometry( 2.552, 1, 25, 9, 0, 6.283185307179586 );

const particlesGeometry = new THREE.BufferGeometry;
const particleCnt = 5000;

const posArray = new Float32Array(particleCnt * 3);

for (let i = 0; i < particleCnt * 3;i++ ){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
} 

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))


// Materials

const material = new THREE.PointsMaterial(
    {size:0.008}
)


const particlesMaterial = new THREE.PointsMaterial(
    {size:0.008, 
    map: cross, 
    transparent: true,
    color: "white",
    blending: THREE.AdditiveBlending
})
material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Points(geometry,material);
const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(sphere, particleMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}




window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color("#21282a"), 1)
/**
 * Animate
 */


//Mouse


let mouseX = 0;
let mouseY = 0;

function animateParticles(event){
    mouseY = (event.clientY) * 0.5;
    mouseX = event.clientX
}
document.addEventListener("mousemove", animateParticles)

const clock = new THREE.Clock()
let elapsedTime


function myFunction() {


}
let pastScreenPos = 0;
const tick = () =>
{
    elapsedTime = clock.getElapsedTime()
    let actualScreenPos = document.documentElement.scrollTop;

    if (actualScreenPos > pastScreenPos) {
        particleMesh.rotation.x =  500 * (elapsedTime * .01);
        
        setTimeout(()=>{
            pastScreenPos = actualScreenPos;
        },500)
    } else if(actualScreenPos < pastScreenPos){
        particleMesh.rotation.x =  -500 * (elapsedTime * .01);
        setTimeout(()=>{
            pastScreenPos = actualScreenPos;
        },500)
    }
    else{
        particleMesh.rotation.y =  (elapsedTime * .08)
    }

    // Update objects
    sphere.rotation.y = (.5 * elapsedTime)

    // Update Orbital Controls
    // controls.update()

    // Render
    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()