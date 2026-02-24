let scene, camera, renderer, controls, earth, raycaster, mouse;
let infoBox = document.getElementById('info-box');

// === Сцена ===
scene = new THREE.Scene();

// === Камера ===
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// === Рендерер ===
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// === Контроль обертання ===
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Світло ===
let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// === Земля ===
// Використовуємо текстури, які точно працюють через GitHub Pages
let earthGeometry = new THREE.SphereGeometry(1, 64, 64);
let earthMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/fireship-io/threejs-earth/main/earthmap1k.jpg'),
    specularMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/fireship-io/threejs-earth/main/earthspec1k.jpg'),
    specular: new THREE.Color('grey'),
    shininess: 5
});
earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// === Raycaster для кліків ===
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

window.addEventListener('click', onClick, false);

function onClick(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObject(earth);

    if(intersects.length > 0){
        infoBox.innerHTML = "<b>Ви натиснули на Землю!</b><br>Можна додати матеріки, океани та цікаві факти.";
    }
}

// === GUI для день/ніч ===
let gui = new dat.GUI();
let settings = { тема: 'День' };
gui.add(settings, 'тема', ['День', 'Ніч']).onChange((value) => {
    if(value === 'День'){
        scene.background = new THREE.Color(0x87CEEB);
        directionalLight.intensity = 1;
        ambientLight.intensity = 0.6;
    } else {
        scene.background = new THREE.Color(0x000022);
        directionalLight.intensity = 0.3;
        ambientLight.intensity = 0.2;
    }
});

// === Анімація ===
function animate(){
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
}

animate();

// === Підгонка при зміні розміру ===
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
