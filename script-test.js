const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

// Configura la niebla con color y distancias ajustadas
const fogColor = new THREE.Color(0x121212); // Color de la niebla
const fogNear = 10; // Distancia de inicio
const fogFar = 35; // Distancia final

scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

// Configura la cámara
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);

// Manejador de eventos para ajustar el tamaño cuando se cambia el tamaño de la ventana
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Renderizar la escena
function render() {
    renderer.render(scene, camera);
}


// Escuchar el evento de redimensionamiento de la ventana y llamar a la función onWindowResize
window.addEventListener('resize', onWindowResize, false);

// Agrega una luz puntual en el centro de la escena
const pointLight = new THREE.PointLight(0xFF7600, 100, 1000); // Color blanco, intensidad 1, distancia de 100
pointLight.position.set(0, 0, 0); // Posición en el centro de la escena
scene.add(pointLight);

// Luz Ambiental y Direccional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Icosaedro principal
const icosahedronGeometry = new THREE.IcosahedronGeometry(9, 0);
const icosahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x2f2f2f, wireframe: true});
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
scene.add(icosahedron);

// Velocidad de rotación Icosaedro Principal
icosahedron.userData.rotationSpeed = new THREE.Vector3(
    0.0006, // X
    0.0006, // Y
    0.0006  // Z
);

const positionAttribute = icosahedronGeometry.attributes.position;
// Usar una variable diferente para la geometría del mini icosaedro
const miniIcosahedronGeometry = new THREE.IcosahedronGeometry(0.7, 0); // Definir la geometría del icosaedro
const createdPositions = []; // Almacenar las posiciones creadas

for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);

    // Verificar si ya se creó un icosaedro en esta posición
    if (!createdPositions.some(pos => pos.equals(vertex))) {
        const icosahedronMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f });
        const miniIcosahedron = new THREE.Mesh(miniIcosahedronGeometry, icosahedronMaterial);

        // Aplicar una posición inicial desplazada en función del índice
        miniIcosahedron.position.copy(vertex).multiplyScalar(1.1);

        // Agregar mini icosaedro child al Icosaedro Principal
        icosahedron.add(miniIcosahedron);

        // Almacenar la posición creada
        createdPositions.push(vertex);

        // Agregar una velocidad de rotación a cada mini icosaedro
        miniIcosahedron.userData.rotationSpeed = new THREE.Vector3(
            Math.random() * 0.01 - 0.006, // X
            Math.random() * 0.01 - 0.006, // Y
            Math.random() * 0.01 - 0.006  // Z
        );
        // rastrear si el mini icosaedro ha sido clickeado
        miniIcosahedron.userData.clicked = false;
    }
}

// Estilo de los mini icosahedro
icosahedron.children.forEach(miniIcosahedron => {
    miniIcosahedron.visible = true; // Visibilidad
});

// Configurar el controlador de eventos de clic
function onDocumentMouseDown(event) {
    event.preventDefault();

    // Calcular la posición del ratón en coordenadas normalizadas (-1 a +1)
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Actualizar el raycaster con la posición del ratón
    raycaster.setFromCamera(mouse, camera);

    // Calcular objetos intersectados
    const intersects = raycaster.intersectObjects(icosahedron.children);

    // Cambiar el color del primer objeto intersectado
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.material.color.getHex() === 0xFFFFFF && !object.material.wireframe) {
            object.material.color.set(0xFF7600); // Cambiar a naranja
        } else if (object.material.color.getHex() === 0x1f1f1f) {
            if (!object.userData.clicked) {
                object.material.color.set(0xFF7600); // Cambiar a blanco
                object.userData.clicked = true;
            } else {
                object.material.color.set(0xFF7600); // Cambiar a naranja oscuro
                object.userData.clicked = false;
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////

// Función para seleccionar aleatoriamente un mini icosaedro y cambiar su color y tamaño temporalmente
function highlightRandomMiniIcosahedron() {
    const availableMiniIcosahedrons = icosahedron.children.filter(miniIcosahedron => {
        return miniIcosahedron.material.color.getHex() === 0x1f1f1f && !miniIcosahedron.userData.clicked;
    });

    if (availableMiniIcosahedrons.length === 0) {
        // Todos los mini icosaedros disponibles ya son naranjas, no hacemos nada
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableMiniIcosahedrons.length);
    const miniIcosahedron = availableMiniIcosahedrons[randomIndex];

    // Cambiar a (wireframe)
    miniIcosahedron.material.wireframe = true;

    // Cambiar el color a naranja
    miniIcosahedron.material.color.set(0xFF7601);
    // miniIcosahedron.material.emissive.set(0xffffff);
    miniIcosahedron.material.emissiveIntensity = 0.7;
    miniIcosahedron.userData.clicked = false; // bloquea mouse click

    // Reducir temporalmente el tamaño del mini icosaedro
    //const originalScale = miniIcosahedron.scale.clone();
    //miniIcosahedron.scale.multiplyScalar(1); // Reducir el tamaño a un 80%

    // temporizador para restaurar el color original, el tamaño y la representación
    setTimeout(() => {
        miniIcosahedron.material.wireframe = false; // Restaurar la representación original
        miniIcosahedron.material.color.set(0x1f1f1f); // Color original
        miniIcosahedron.scale.copy(originalScale); // Restaurar el tamaño original
        // miniIcosahedron.material.wireframe = false;
    }, 3000); // milisegundos antes de restaurar el color, tamaño y representación
}
// Llamar a la función cada cierto tiempo
setInterval(highlightRandomMiniIcosahedron, 3000); // milisegundos

//////////////////////////////////////////////////////////////////////////////////////

// Función para comprobar si todos los mini icosaedros son naranjas
function allIcosahedronsAreOrange() {
    return icosahedron.children.every(miniIcosahedron =>
        miniIcosahedron.material.color.equals(new THREE.Color(0xFF7600))
    );
}
// Función para comprobar si todos los mini icosaedros son blancos
function allIcosahedronsAreWhite() {
    return icosahedron.children.every(miniIcosahedron =>
        miniIcosahedron.material.color.equals(new THREE.Color(0xFFFFFF))
    );
}

// Función para reiniciar los colores de los mini icosaedros
function resetMiniIcosahedronsColor() {
    icosahedron.children.forEach(miniIcosahedron => {
        miniIcosahedron.material.color.set(0x1f1f1f); // Color por defecto
        miniIcosahedron.userData.clicked = false;
    });
}

// Agregar el controlador de eventos de clic al documento
document.addEventListener('mousedown', onDocumentMouseDown, false);

// Raycaster para interacción
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Variables globales para controlar la animación
let isAnimating = false;
let rotationSpeed = { x: 0.0005, y: 0.0005 }; // Velocidad normal de rotación
let maxRotationSpeed = { x: 0.1, y: 0.1 }; // Velocidad máxima para la animación rápida

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Comprobar si todos los mini icosaedros son naranjas
    if (allIcosahedronsAreOrange()) {
        // Aumentar la velocidad de rotación para el efecto de giro rápido
        icosahedron.rotation.x += 0.02;
        icosahedron.rotation.y += 0.02;
        icosahedron.rotation.z += 0.02;

        // timeout para detener evento de giro
        setTimeout(() => {
            resetMiniIcosahedronsColor();
        }, 5000); // tiempo milisegundos
    }

    // Comprobar si todos los mini icosaedros son balncos
    if (allIcosahedronsAreWhite()) {
        // time out giro blanco
        setTimeout(() => {
            resetMiniIcosahedronsColor();// reset
        }, 1000); // milisegundos
    }

    // Rotación del icosaedro basado en su velocidad de rotación
    icosahedron.rotation.x += icosahedron.userData.rotationSpeed.x;
    icosahedron.rotation.y += icosahedron.userData.rotationSpeed.y;
    icosahedron.rotation.z += icosahedron.userData.rotationSpeed.z;

    // Rotación individual de los mini icosahedros
    icosahedron.children.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
    });

    renderer.render(scene, camera);
}

animate();

// Evento para iniciar el arrastre
renderer.domElement.addEventListener('mousedown', event => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Evento para detener el arrastre
renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

// Evento de arrastre
renderer.domElement.addEventListener('mousemove', event => {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.001; // velocidad de arrastre

    icosahedron.rotation.x += deltaMove.y * rotationSpeed;
    icosahedron.rotation.y += deltaMove.x * rotationSpeed;

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Eventos táctiles para dispositivos móviles
renderer.domElement.addEventListener('touchstart', event => {
    isDragging = true;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('touchmove', event => {
    if (!isDragging || event.touches.length !== 1) return;

    const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.005;

    icosahedron.rotation.x += deltaMove.y * rotationSpeed;
    icosahedron.rotation.y += deltaMove.x * rotationSpeed;

    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
    // Evitar la recarga de la página al hacer drag hacia abajo
    event.preventDefault();
});
















