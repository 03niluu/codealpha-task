const galleryItems = Array.from(document.querySelectorAll('.image-list li'));
const galleryImages = galleryItems.map((item) => item.querySelector('img'));
const viewer = document.querySelector('#image-viewer');
const viewerImage = document.querySelector('#viewer-image');
const closeButton = document.querySelector('#viewer-close');
const previousButton = document.querySelector('#viewer-previous');
const nextButton = document.querySelector('#viewer-next');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
let currentImageIndex = 0;
let activeFilter = 'all';

function getVisibleImages() {
    return galleryItems.filter((item) => {
        const matchesType = activeFilter === 'all' || item.dataset.type === activeFilter;
        item.classList.toggle('is-hidden', !matchesType);
        return matchesType;
    }).map((item) => item.querySelector('img'));
}

function showImage(index) {
    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) {
        return;
    }

    currentImageIndex = (index + visibleImages.length) % visibleImages.length;
    const image = visibleImages[currentImageIndex];

    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
}

function openViewerFromImage(image) {
    const visibleImages = getVisibleImages();
    const index = visibleImages.indexOf(image);

    if (index === -1) {
        return;
    }

    currentImageIndex = index;
    showImage(index);
    viewer.showModal();
}

function openViewer(index) {
    showImage(index);
    viewer.showModal();
}

function closeViewer() {
    viewer.close();
}

function setFilter(filter) {
    activeFilter = filter;

    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) {
        closeViewer();
        return;
    }

    currentImageIndex = 0;
    showImage(0);
}

galleryItems.forEach((item) => {
    const image = item.querySelector('img');

    image.addEventListener('click', () => openViewerFromImage(image));
    image.tabIndex = 0;
    image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openViewerFromImage(image);
        }
    });
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
});

closeButton.addEventListener('click', closeViewer);
previousButton.addEventListener('click', () => showImage(currentImageIndex - 1));
nextButton.addEventListener('click', () => showImage(currentImageIndex + 1));

viewer.addEventListener('click', (event) => {
    if (event.target === viewer) {
        closeViewer();
    }
});

document.addEventListener('keydown', (event) => {
    if (!viewer.open) {
        return;
    }

    if (event.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
    } else if (event.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
    } else if (event.key === 'Escape') {
        closeViewer();
    }
});

setFilter(activeFilter);
