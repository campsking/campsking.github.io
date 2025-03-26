const logos = [
    'galeria_pic/Logos-01.png',
    'galeria_pic/Logos-02.png',
    'galeria_pic/Logos-03.png',
    'galeria_pic/Logos-04.png',
    'galeria_pic/Logos-05.png'
];

const products = [
    'galeria_pic/packagin_1.png',
    'galeria_pic/packagin_2.png',
    'galeria_pic/packagin_3.png',
    'galeria_pic/packagin_4.png',
    'galeria_pic/packagin_5.png'
];

// Shuffle the logos array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const shuffledLogos = shuffle(logos);

// Assign logos to grid cells
document.querySelectorAll('.parent > div').forEach((div, index) => {
    if (index < shuffledLogos.length) {
        const img = document.createElement('img');
        img.src = shuffledLogos[index];
        img.alt = `Logo ${index + 1}`;
        div.appendChild(img);
    }
});

document.querySelectorAll('.parent > div').forEach((div, index) => {
    div.addEventListener('click', () => {
        if (div.classList.contains('enlarged')) {
            div.classList.remove('enlarged');
            const img = div.querySelector('img');
            img.src = shuffledLogos[index];
        } else {
            document.querySelectorAll('.parent > div').forEach(d => d.classList.remove('enlarged'));
            div.classList.add('enlarged');
            const img = div.querySelector('img');
            img.src = products[index];
        }
    });
});

// Add event listener for mouse wheel to change images when enlarged
document.querySelectorAll('.parent > div').forEach((div, index) => {
    div.addEventListener('wheel', (event) => {
        if (div.classList.contains('enlarged')) {
            event.preventDefault();
            const img = div.querySelector('img');
            const currentIndex = products.findIndex(image => img.src.includes(image));
            let newIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);
            if (newIndex < 0) newIndex = products.length - 1;
            if (newIndex >= products.length) newIndex = 0;
            img.src = products[newIndex];
        }
    });
});

// Add swipe navigation for mobile devices
document.querySelectorAll('.parent > div').forEach((div, index) => {
    let touchstartX = 0;
    let touchendX = 0;

    div.addEventListener('touchstart', (event) => {
        touchstartX = event.changedTouches[0].screenX;
    });

    div.addEventListener('touchend', (event) => {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe(event, div, index);
    });

    function handleSwipe(event, div, index) {
        if (div.classList.contains('enlarged')) {
            const img = div.querySelector('img');
            const currentIndex = products.findIndex(image => img.src.includes(image));
            let newIndex = currentIndex;

            if (touchendX < touchstartX) {
                // Swiped left
                newIndex = currentIndex + 1;
                if (newIndex >= products.length) newIndex = 0;
            }
            if (touchendX > touchstartX) {
                // Swiped right
                newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = products.length - 1;
            }

            img.src = products[newIndex];
        }
    }
});
