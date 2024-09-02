let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;
let startX, startY, isDragging = false;
const umbralVertical = 50; // Ajusta este valor para controlar la sensibilidad del desplazamiento vertical

// Selecciona todas las galerías
document.querySelectorAll('.galeria-lista').forEach(galeria => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Evento para desplazamiento con la rueda del ratón en la galería
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

    galeria.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - galeria.offsetLeft; // Guarda la posición inicial del mouse
        scrollLeft = galeria.scrollLeft; // Guarda la posición inicial de desplazamiento
        galeria.classList.add('active'); // Cambia el cursor a agarrando
    });

    galeria.addEventListener('mouseleave', () => {
        isDragging = false;
        galeria.classList.remove('active');
    });

    galeria.addEventListener('mouseup', () => {
        isDragging = false;
        galeria.classList.remove('active');
    });

    galeria.addEventListener('mousemove', (e) => {
        if (!isDragging) return; // Si no está en proceso de arrastre, no hacer nada
        e.preventDefault();
        const x = e.pageX - galeria.offsetLeft;
        const walk = (x - startX) * 3; // Ajusta la sensibilidad del arrastre aquí
        galeria.scrollLeft = scrollLeft - walk;
    });
});

function abrirEnPantallaCompleta() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

// Agregar evento a cada enlace
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Hacer scroll al elemento con el ID correspondiente
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
