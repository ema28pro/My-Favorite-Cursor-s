const container = document.getElementById('galleries-container');

// --- Fake Cursor Logic for Home ---
const fakeCursor = document.createElement('img');
fakeCursor.id = 'home-fake-cursor';
Object.assign(fakeCursor.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    width: '48px', // Tamaño aumentado (normalmente 32px)
    height: 'auto',
    display: 'none',
    imageRendering: 'pixelated'
});
document.body.appendChild(fakeCursor);

document.addEventListener('mousemove', (e) => {
    if (fakeCursor.style.display !== 'none') {
        fakeCursor.style.left = e.clientX + 'px';
        fakeCursor.style.top = e.clientY + 'px';
    }
});

function createSection(title, content, link = null) {
    const section = document.createElement('section');
    section.style.marginBottom = '4rem';

    if (title) {
        const heading = document.createElement('h2');

        if (link) {
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.textContent = title;
            anchor.target = '_blank';
            anchor.style.color = '#555';
            anchor.style.textDecoration = 'none';
            anchor.style.borderBottom = '1px dashed #999';
            anchor.title = "Ir al sitio de descarga";
            heading.appendChild(anchor);
        } else {
            heading.textContent = title;
        }

        heading.style.textAlign = 'center';
        heading.style.marginBottom = '2rem';
        heading.style.color = '#555';
        heading.style.fontWeight = '300';
        heading.style.fontSize = '2rem';
        section.appendChild(heading);
    }

    section.appendChild(content);
    return section;
}

function renderMyCursors() {
    const gallery = document.createElement('div');
    gallery.className = 'gallery';

    myCursorsData.forEach((cursor, index) => {
        const card = document.createElement('div');
        card.className = 'cursor-card';

        // Link to detail page
        const linkUrl = cursor.id ? `cursor.html?id=${cursor.id}` : `cursor.html?name=${encodeURIComponent(cursor.name)}`;

        // Make the whole card clickable (except buttons)
        card.onclick = (e) => {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                window.location.href = linkUrl;
            }
        };

        // Logic for shadow toggle
        const hasShadow = cursor.shadow !== null;
        let currentFile = cursor.normal;

        const updateCardCursor = (file) => {
            const cursorPath = cursorFolder + file;
            // Ocultamos el cursor nativo en la card para usar el fake
            card.style.cursor = 'none';

            // Guardamos la URL para el fake cursor
            card.dataset.cursorUrl = cursorPath;

            // Si el mouse ya está encima, actualizamos el fake cursor inmediatamente
            if (card.matches(':hover')) {
                fakeCursor.src = cursorPath;
            }

            img.src = cursorPath;
        };

        // Eventos para el Fake Cursor
        card.addEventListener('mouseenter', () => {
            fakeCursor.src = card.dataset.cursorUrl;
            fakeCursor.style.display = 'block';
        });

        card.addEventListener('mouseleave', () => {
            fakeCursor.style.display = 'none';
        });

        const display = document.createElement('div');
        display.className = 'cursor-display';

        const img = document.createElement('img');
        img.className = 'cursor-img';
        img.src = cursorFolder + cursor.normal;
        img.alt = cursor.name;

        display.appendChild(img);

        const name = document.createElement('div');
        name.className = 'cursor-name';
        name.textContent = cursor.name;

        const controls = document.createElement('div');
        controls.className = 'card-controls';

        // Shadow Option
        if (hasShadow) {
            const shadowOption = document.createElement('div');
            shadowOption.className = 'shadow-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `shadow-home-${index}`;

            const label = document.createElement('label');
            label.htmlFor = `shadow-home-${index}`;
            label.textContent = 'Versión con sombra';

            checkbox.addEventListener('change', (e) => {
                currentFile = e.target.checked ? cursor.shadow : cursor.normal;
                updateCardCursor(currentFile);
            });

            // Prevent click propagation to card
            checkbox.onclick = (e) => e.stopPropagation();
            label.onclick = (e) => e.stopPropagation();

            shadowOption.appendChild(checkbox);
            shadowOption.appendChild(label);
            controls.appendChild(shadowOption);
        }

        // Detail Button
        const detailBtn = document.createElement('a');
        detailBtn.textContent = 'Ver Detalle 3D';
        detailBtn.href = linkUrl;

        // Estilos inline para botón secundario/menos ruidoso
        detailBtn.style.display = 'block';
        detailBtn.style.textAlign = 'center';
        detailBtn.style.padding = '0.4rem';
        detailBtn.style.fontSize = '0.85rem';
        detailBtn.style.color = '#666';
        detailBtn.style.backgroundColor = 'transparent';
        detailBtn.style.border = '1px solid #ddd';
        detailBtn.style.borderRadius = '4px';
        detailBtn.style.textDecoration = 'none';
        detailBtn.style.marginTop = '0.5rem';
        detailBtn.style.transition = 'all 0.2s';

        detailBtn.onmouseover = () => {
            detailBtn.style.borderColor = '#bbb';
            detailBtn.style.color = '#333';
            detailBtn.style.backgroundColor = '#f9f9f9';
        };
        detailBtn.onmouseout = () => {
            detailBtn.style.borderColor = '#ddd';
            detailBtn.style.color = '#666';
            detailBtn.style.backgroundColor = 'transparent';
        };

        // Download Button (Both versions)
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'btn-download';
        downloadBtn.textContent = 'Descargar Pack';
        downloadBtn.href = '#';
        downloadBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Helper to trigger download
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
                }, 500); // Small delay to ensure browser handles both
            }
        };

        controls.appendChild(downloadBtn);
        controls.appendChild(detailBtn);

        card.appendChild(display);
        card.appendChild(name);
        card.appendChild(controls);

        gallery.appendChild(card);

        // Initialize cursor
        updateCardCursor(currentFile);
    });

    return createSection('', gallery);
}

function renderOtherCollection(collection) {
    const gallery = document.createElement('div');
    gallery.className = 'gallery';

    collection.items.forEach(filename => {
        const card = document.createElement('div');
        card.className = 'cursor-card';

        // Ocultar cursor nativo
        card.style.cursor = 'none';

        // Determinar URL visual para el fake cursor
        var IsAni = filename.endsWith('.ani');
        let visualUrl = collection.folder + filename;

        if (IsAni) {
            // Usar GIF para animados
            visualUrl = collection.folder + filename.replace('.ani', '.gif');
        }

        card.dataset.cursorUrl = visualUrl;

        // Eventos Fake Cursor
        card.addEventListener('mouseenter', () => {
            fakeCursor.src = card.dataset.cursorUrl;
            fakeCursor.style.display = 'block';
        });

        card.addEventListener('mouseleave', () => {
            fakeCursor.style.display = 'none';
        });

        const display = document.createElement('div');
        display.className = 'cursor-display';

        // Check if it's an animated cursor (.ani) or static (.cur)
        // Browsers don't support .ani in <img> tags usually, but we can try or use a placeholder


        const img = document.createElement('img');
        img.className = 'cursor-img';

        // Use GIF if it's an animation, otherwise use the file itself
        if (IsAni) {
            img.src = collection.folder + filename.replace('.ani', '.gif');
        } else {
            img.src = collection.folder + filename;
        }

        img.alt = filename;

        // Fallback just in case the GIF is missing
        img.onerror = function () {
            if (IsAni) {
                // Try the original .ani as a last resort or show placeholder
                this.src = collection.folder + filename;
                this.onerror = function () {
                    this.style.display = 'none';
                    display.innerHTML = '<div style="text-align:center; color:#aaa;"><div style="font-size:2rem;">✨</div><div style="font-size:0.8rem; margin-top:0.5rem;">Animado</div></div>';
                }
            }
        };

        display.appendChild(img);

        const name = document.createElement('div');
        name.className = 'cursor-name';
        // Clean up filename for display
        name.textContent = filename.replace(/\.(cur|ani)$/, '');
        name.style.fontSize = '1rem';

        const controls = document.createElement('div');
        controls.className = 'card-controls';

        // Only add download button if it's NOT a simple collection
        if (!collection.simple) {
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn-download';
            downloadBtn.textContent = 'Descargar';
            downloadBtn.href = collection.folder + filename;
            downloadBtn.download = filename;
            controls.appendChild(downloadBtn);
        }

        card.appendChild(display);
        card.appendChild(name);

        // Only append controls if there are any
        if (controls.hasChildNodes()) {
            card.appendChild(controls);
        }

        gallery.appendChild(card);
    });

    return createSection(collection.title, gallery, collection.link);
}

// Render All
container.appendChild(renderMyCursors());

otherCollections.forEach(collection => {
    container.appendChild(renderOtherCollection(collection));
});
