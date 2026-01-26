export function makeDraggable(el, onDragEnd = null, container = document.body) {
    const header = el.querySelector('.window-header') || el;

    header.addEventListener('mousedown', e => {
        e.preventDefault();

        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const offsetX = e.clientX - elRect.left;
        const offsetY = e.clientY - elRect.top;

        el.style.position = 'absolute';
        el.style.zIndex = Date.now();
        document.body.style.userSelect = 'none';

        function onMouseMove(e) {
            let x = e.clientX - containerRect.left - offsetX;
            let y = e.clientY - containerRect.top - offsetY;

            x = Math.max(0, Math.min(container.clientWidth - elRect.width, x));
            y = Math.max(0, Math.min(container.clientHeight - elRect.height, y));

            el.style.left = x + 'px';
            el.style.top = y + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = '';
            if (onDragEnd) onDragEnd();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}
