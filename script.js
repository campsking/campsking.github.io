let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;
let startX, startY, isDragging = false;
const umbralVertical = 50; // Ajusta este valor para controlar la sensibilidad del desplazamiento vertical

// Función para cambiar la sección activa
function cambiarSeccionActiva(nuevoIndice) {
    if (nuevoIndice >= 0 && nuevoIndice < secciones.length) {
        secciones.forEach(seccion => seccion.classList.remove('activa'));
        secciones[nuevoIndice].classList.add('activa');
        indiceSeccionActual = nuevoIndice;
    }
}

// Evento de clic para cambiar secciones
secciones.forEach((seccion, indice) => {
    seccion.addEventListener('click', (evento) => {
        // Verificar si el clic fue dentro de un elemento de la galería
        if (evento.target.closest('.elemento-galeria')) {
            return; // No hacer nada si el clic fue en la galería
        }

        if (seccion.classList.contains('activa')) {
            seccion.classList.remove('activa'); // Desactivar la sección si ya está activa
        } else {
            cambiarSeccionActiva(indice); // Activar la sección si no está activa
        }
    });
});

// Agregar evento para desplazamiento con la rueda del ratón en la galería
const galeria = document.querySelector('.galeria');
galeria.addEventListener('wheel', (e) => {
    // Calcular la posición máxima de desplazamiento horizontal
    const maxScrollLeft = galeria.scrollWidth - galeria.clientWidth;

    // Comprobar si la galería está al principio o al final de su desplazamiento horizontal
    if ((galeria.scrollLeft === 0 && e.deltaY < 0) || (galeria.scrollLeft === maxScrollLeft && e.deltaY > 0)) {
        // No hacer nada si la galería está en uno de sus extremos
        return;
    }

    // Prevenir el desplazamiento vertical predeterminado y desplazar horizontalmente
    e.preventDefault();
    const desplazamiento = e.deltaY * 0.5; // Ajustar según sea necesario
    galeria.scrollLeft += desplazamiento;
});

galeria.addEventListener('mouseup', (e) => {
    isDragging = false;
    e.stopPropagation(); // Previene la propagación del evento al elemento padre
});

galeria.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galeria.offsetLeft; // Cambio a coordenadas horizontales
    const walk = (x - startX) * 2; // Multiplicador de velocidad de arrastre
    galeria.scrollLeft = scrollLeft - walk; // Cambio a desplazamiento horizontal
});

function abrirEnPantallaCompleta() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

function togglePrototipo() {
    var protoContainer = document.querySelector('.btn_proto');
    var toggleButton = document.getElementById('botonMostrarProto');

    if (protoContainer.style.display === 'none' || protoContainer.style.display === '') {
        protoContainer.classList.add('boton-mostrar');
        protoContainer.style.display = 'flex';
        toggleButton.classList.add('boton-ocultar');
        setTimeout(function () {
            toggleButton.style.display = 'none';
        }, 500); // Coincide con la duración de la animación
    } else {
        toggleButton.classList.remove('boton-ocultar');
        toggleButton.style.display = 'block';
        toggleButton.classList.add('boton-mostrar');
        protoContainer.classList.add('boton-ocultar');
        setTimeout(function () {
            protoContainer.style.display = 'none';
            protoContainer.classList.remove('boton-mostrar');
            protoContainer.classList.remove('boton-ocultar');
        }, 500); // Coincide con la duración de la animación
    }
}

function mostrarPrototipo(prototipoId) {
    // Ocultar todos los prototipos
    document.querySelectorAll('.seccion .prototipo').forEach(prototipo => {
        prototipo.style.display = 'none';
    });

    // Mostrar el prototipo seleccionado
    document.getElementById(prototipoId).style.display = 'block';

    // Ocultar los botones de prototipo y mostrar el botón pequeño
    document.querySelector('.btn_proto').style.display = 'none';
    document.getElementById('botonMostrarProto').style.display = 'block';
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const extraInfo = card.querySelector('.extra-info');
        if (extraInfo.style.display === 'none') {
            extraInfo.style.display = 'block';
        } else {
            extraInfo.style.display = 'none';
        }
    });
});


document.querySelectorAll('.elemento-galeria').forEach(elemento => {
    // Inicializar el estado para el primer toque
    elemento.primerToque = true;

    // Manejador para dispositivos táctiles
    elemento.addEventListener('touchstart', function (event) {

        event.stopPropagation(); // Detener la propagación del evento

        if (elemento.primerToque) {
            // Solo mostrar el overlay en el primer toque
            controlarOverlay(this);
            elemento.primerToque = false;
        } else {
            // Incrementar likes y mostrar overlay en toques subsiguientes
            incrementarLikes(this);
        }
    });

    // Manejador para clic del ratón en modo desktop
    elemento.addEventListener('click', function (event) {
        manejarInteraccion(this, false); // false indica que no es un evento táctil
    });
});

function manejarInteraccion(elemento, esTactil) {
    if (!esTactil || !elemento.primerToque) {
        // Incrementar el contador de likes solo si no es el primer toque en táctil
        incrementarLikes(elemento);
    }

    // Controlar la visualización del overlay
    controlarOverlay(elemento);

    // Si es un dispositivo táctil, establecer que ya no es el primer toque
    if (esTactil) {
        elemento.primerToque = false;
    }
}

function incrementarLikes(elemento) {
    let contador = elemento.querySelector('.like-counter');
    if (contador) {
        contador.textContent = parseInt(contador.textContent) + 1;
    }
}











