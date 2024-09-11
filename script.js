let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;
let startX, startY, isDragging = false;
const umbralVertical = 50; // Ajusta este valor para controlar la sensibilidad del desplazamiento vertical

// Selecciona todas las galerías
document.querySelectorAll('.galeria-lista').forEach(galeria => {
    let isDragging = false;
    let startX;
    let scrollLeft;

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


document.addEventListener("DOMContentLoaded", function() {
    let iframes = document.querySelectorAll('iframe[data-src]');
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let iframe = entry.target;
                iframe.src = iframe.getAttribute('data-src');
                observer.unobserve(iframe);
            }
        });
    });

    iframes.forEach(iframe => {
        observer.observe(iframe);
    });
});

