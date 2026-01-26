import { saveDesktopState, loadDesktopState } from './state.js';

export function makeIconsDraggable() {
    const icons = document.querySelectorAll('.icon');
    const savedState = loadDesktopState();
    const iconsState = savedState.icons || {};

    const startX = 20;
    const startY = 20;
    const spacingX = 100;
    const spacingY = 100;
    const iconSize = 64;
    const maxRows = 5;

    let row = 0;
    let col = 0;

    icons.forEach(icon => {
        const id = icon.dataset.window;
        icon.style.width = iconSize + 'px';
        icon.style.height = iconSize + 'px';
        icon.style.position = 'absolute';

        // choose load or default
        if (iconsState[id]) {
            icon.style.left = iconsState[id].left + 'px';
            icon.style.top = iconsState[id].top + 'px';
        } else {
            const left = startX + col * spacingX;
            const top = startY + row * spacingY;
            icon.style.left = left + 'px';
            icon.style.top = top + 'px';
            iconsState[id] = { left, top };
            row++;
            if (row >= maxRows) { row = 0; col++; }
        }

        let offsetX = 0;
        let offsetY = 0;

        icon.addEventListener('mousedown', e => {
            e.preventDefault();
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;

            document.body.style.userSelect = 'none';

            function onMouseMove(e) {
                // Move icon while dragging
                icon.style.left = e.clientX - offsetX + 'px';
                icon.style.top = e.clientY - offsetY + 'px';
            }

            function onMouseUp(e) {
                // Snap to grid on place
                let finalLeft = e.clientX - offsetX;
                let finalTop = e.clientY - offsetY;

                finalLeft = Math.round((finalLeft - startX) / spacingX) * spacingX + startX;
                finalTop = Math.round((finalTop - startY) / spacingY) * spacingY + startY;

                icon.style.left = finalLeft + 'px';
                icon.style.top = finalTop + 'px';

                // Cleanup
                iconsState[id] = { left: finalLeft, top: finalTop };
                saveDesktopState([], iconsState);

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.userSelect = '';
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });

    // save initial icons positions, this is so they dont sit on eachother
    saveDesktopState([], iconsState);
}
