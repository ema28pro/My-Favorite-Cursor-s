// Helper to get URL params
const urlParams = new URLSearchParams(window.location.search);
const cursorId = urlParams.get('id');
const cursorName = urlParams.get('name');

// Find cursor
let cursorData = null;

if (cursorId) {
    cursorData = myCursorsData.find(c => c.id === cursorId);
} else if (cursorName) {
    cursorData = myCursorsData.find(c => c.name === cursorName);
}

if (!cursorData) {
    document.querySelector('main').innerHTML = '<h2>Cursor no encontrado</h2><a href="index.html">Volver</a>';
} else {
    initDetail(cursorData);
}

function initDetail(cursor) {
    // --- DOM Elements ---
    const cursorNameEl = document.getElementById('cursor-name');
    const previewImg = document.getElementById('preview-3d');
    const originalLink = document.getElementById('original-link');
    const downloadBtn = document.getElementById('download-btn');
    const shadowContainer = document.getElementById('shadow-control-container');
    const sizeSlider = document.getElementById('cursor-size');
    const sizeValue = document.getElementById('size-value');
    const fakeCursor = document.getElementById('fake-cursor');

    // --- State ---
    let currentFile = cursor.normal;
    let cursorSize = 32;

    // --- Initialization ---
    cursorNameEl.textContent = cursor.name;

    // Set 3D Image / Preview
    if (cursor.id) {
        previewImg.src = `https://www.cursor.cc/cursor3d/${cursor.id}.png`;
    } else {
        previewImg.src = cursorFolder + cursor.normal;
        previewImg.style.width = '64px';
        previewImg.style.imageRendering = 'pixelated';
    }

    // Set Original Link
    if (cursor.id) {
        originalLink.href = `https://www.cursor.cc/?action=icon&file_id=${cursor.id}`;
    } else {
        originalLink.style.display = 'none';
    }

    // --- Core Functions ---

    const updateVisuals = () => {
        const fullPath = cursorFolder + currentFile;

        // Update Fake Cursor Image
        fakeCursor.src = fullPath;
    };

    // --- Download Logic (Both versions) ---
    downloadBtn.onclick = (e) => {
        e.preventDefault();

        const triggerDownload = (url, name) => {
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // Download Normal
        triggerDownload(cursorFolder + cursor.normal, cursor.normal);

        // Download Shadow if exists
        if (cursor.shadow) {
            setTimeout(() => {
                triggerDownload(cursorFolder + cursor.shadow, cursor.shadow);
            }, 500);
        }
    };

    const updateSize = (size) => {
        cursorSize = size;
        fakeCursor.style.width = `${size}px`;
        fakeCursor.style.height = 'auto'; // Maintain aspect ratio
        if (sizeValue) sizeValue.textContent = `${size}px`;
    };

    // --- Event Listeners ---

    // 1. Mouse Movement for Fake Cursor
    document.addEventListener('mousemove', (e) => {
        fakeCursor.style.left = `${e.clientX}px`;
        fakeCursor.style.top = `${e.clientY}px`;
    });

    // 2. Cursor Size Slider
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            updateSize(e.target.value);
        });
    }

    // 3. Shadow Toggle
    if (cursor.shadow) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'shadow-toggle-detail';

        const label = document.createElement('label');
        label.htmlFor = 'shadow-toggle-detail';
        label.textContent = 'Versión con sombra';
        label.style.marginLeft = '0.5rem';
        label.style.cursor = 'none';

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        shadowContainer.appendChild(wrapper);

        checkbox.addEventListener('change', (e) => {
            currentFile = e.target.checked ? cursor.shadow : cursor.normal;
            updateVisuals();
        });
    }

    // 4. Hide Native Cursor globally
    const hideNativeCursor = () => {
        document.body.style.cursor = 'none';
        fakeCursor.style.display = 'block';

        // Force all elements to have no cursor via injected style
        const style = document.createElement('style');
        style.innerHTML = `
            * { cursor: none !important; }
        `;
        document.head.appendChild(style);
    };

    // --- Draggable Logic (Updated for Fake Cursor) ---
    initDraggable();

    // --- Start ---
    updateVisuals();
    updateSize(32); // Default size
    hideNativeCursor();
}

function initDraggable() {
    const draggable = document.getElementById('draggable');
    const container = document.getElementById('drag-area');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    draggable.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get current position relative to parent
        initialLeft = draggable.offsetLeft;
        initialTop = draggable.offsetTop;

        draggable.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Boundaries
        const maxLeft = container.clientWidth - draggable.offsetWidth;
        const maxTop = container.clientHeight - draggable.offsetHeight;

        // Clamp
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        draggable.style.left = `${newLeft}px`;
        draggable.style.top = `${newTop}px`;
        draggable.style.position = 'absolute';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        draggable.style.opacity = '1';
    });
}