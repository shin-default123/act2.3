import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()

// Load textures for the door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


// Load textures for the bricks (walls)
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// Load textures for the grass (floor)
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// Set repeat and wrap settings for the grass textures
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House container
 */
const house = new THREE.Group()
scene.add(house)



/**
 * House: Walls (with brick textures)
 */
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4), // Width, Height, Depth of the walls
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture, // Color texture for the bricks
        aoMap: bricksAmbientOcclusionTexture, // Ambient occlusion map
        normalMap: bricksNormalTexture, // Normal map for surface detail
        roughnessMap: bricksRoughnessTexture // Roughness map for material properties
    })
)
walls.position.y = 1.25 // Position the walls so they sit on the floor
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)) // Set uv2 for ao map
house.add(walls) // Add the walls to the house group
walls.castShadow = true

/**
 * House: Roof
 */
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4), // Base radius, height, number of segments
    new THREE.MeshStandardMaterial({ color: '#b35f45' }) // Material for the roof
)
roof.rotation.y = Math.PI * 0.25 // Rotate the roof for the correct orientation
roof.position.y = 2.5 + 0.5 // Position the roof on top of the walls (y = height of walls + half the roof height)
house.add(roof) // Add the roof to the house group

// Door light
const doorLight = new THREE.PointLight('#ffff00', 2, 5) // Set the light color and range
doorLight.position.set(2, 2, 2) // Position the light near the door (adjust as needed)
doorLight.castShadow = true // Enable shadow casting

// Set some shadow properties for better quality
doorLight.shadow.mapSize.width = 256; // Increase shadow resolution
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7; // Set the far distance for shadow camera
doorLight.shadow.bias = -0.005; // Reduce shadow artifacts

// Add the door light to the scene
scene.add(doorLight)


/**
 * House: Door (with textures)
 */
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // Updated geometry to 2.2x2.2 with subdivisions (100x100)
    new THREE.MeshStandardMaterial({
        map: doorColorTexture, // Color texture
        transparent: true, // Transparency enabled
        alphaMap: doorAlphaTexture, // Alpha texture (for transparency)
        aoMap: doorAmbientOcclusionTexture, // Ambient occlusion texture
        displacementMap: doorHeightTexture, // Height map (displacement)
        displacementScale: 0.1, // Scale for displacement effect
        normalMap: doorNormalTexture, // Normal map for surface detail
        metalnessMap: doorMetalnessTexture, // Metalness map for material properties
        roughnessMap: doorRoughnessTexture // Roughness map for material properties
        
    })
)
// Set the UV2 attribute for the door geometry (important for certain maps like ambient occlusion)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.y = 1 // Position the door at ground level
door.position.z = 2 + 0.01 // Slightly offset the door from the walls to prevent z-fighting
house.add(door) // Add the door to the house group


/**
 * Bushes
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

// Add bushes to the house
house.add(bush1, bush2, bush3, bush4)

/**
 * Graves
 */
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

// Create 50 random graves
for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 6 // Random radius
    const x = Math.cos(angle) * radius // Get the x position using cosinus
    const z = Math.sin(angle) * radius // Get the z position using sinus

    // Create the grave mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position the grave
    grave.position.set(x, 0.3, z)

    // Add some random rotation for variety
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    // Add the grave to the graves group
    graves.add(grave)
}

// Ensure graves cast shadows
for (let i = 0; i < 50; i++) {
    const grave = graves.children[i];  // Assuming you added them to the graves group
    grave.castShadow = true;
}

/**
 * Floor (with grass textures)
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture, // Color texture for the grass
        aoMap: grassAmbientOcclusionTexture, // Ambient occlusion map for the grass
        normalMap: grassNormalTexture, // Normal map for surface detail
        roughnessMap: grassRoughnessTexture // Roughness map for material properties
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)) // Set uv2 for ao map
floor.rotation.x = - Math.PI * 0.5 // Rotate floor to be horizontal
floor.position.y = 0 // Position floor at ground level
scene.add(floor)

// Receive shadows on floor
floor.receiveShadow = true;

// Adjust floor for shadow reception
floor.material.shadowSide = THREE.FrontSide;

/**
 * Lights
 */
// Ambient light (updated)
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12) // Light color set to a soft light blue with lower intensity
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001) // Expose intensity for tweaking
scene.add(ambientLight)

// Moon light (updated)
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
moonLight.castShadow = true // Enable shadows
moonLight.shadow.mapSize.width = 256 // Set shadow map size
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15 // Shadow camera far distance
moonLight.shadow.bias = -0.005 // Reduce shadow artifacts
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)



/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 15) // Fog color, near distance, far distance
scene.fog = fog // Apply fog to the scene

/**
* Ghosts
*/
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Set the clear color (background color) for the renderer
renderer.setClearColor('#262837') // Set background to a dark grayish-blue (same as fog)

document.body.appendChild(renderer.domElement) // Add renderer to the DOM

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
const ghost1Angle = elapsedTime * 0.5
ghost1.position.x = Math.cos(ghost1Angle) * 4
ghost1.position.z = Math.sin(ghost1Angle) * 4
ghost1.position.y = Math.sin(elapsedTime * 3)
const ghost2Angle = - elapsedTime * 0.32
ghost2.position.x = Math.cos(ghost2Angle) * 5
ghost2.position.z = Math.sin(ghost2Angle) * 5
ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime *
2.5)
const ghost3Angle = - elapsedTime * 0.18
ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime *
0.32))
ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime *
0.5))
ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime *
2.5)



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
