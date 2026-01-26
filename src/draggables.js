export function makeDraggable(el, onDragEnd = null, container = document.body) {
    const header = el.querySelector('.window-header') || el;

    header.addEventListener('mousedown', e => {
        e.preventDefault();

        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const headerOffsetTop = headerRect.top - elRect.top;
        const headerHeight = headerRect.height;

        const offsetX = e.clientX - elRect.left;
        const offsetY = e.clientY - elRect.top;

        el.style.position = 'absolute';
        el.classList.add('dragging');
        document.body.style.userSelect = 'none';

        function onMouseMove(e) {
            const x = e.clientX - containerRect.left - offsetX;
            let y = e.clientY - containerRect.top - offsetY;

            const taskbar = document.getElementById('taskbar');
            if (taskbar) {
                const taskbarRect = taskbar.getBoundingClientRect();
                const headerTopInContainer = y + headerOffsetTop;
                const maxHeaderTop = taskbarRect.top - containerRect.top - headerHeight;
                if (headerTopInContainer > maxHeaderTop) {
                    y = maxHeaderTop - headerOffsetTop;
                }
            }

            el.style.left = x + 'px';
            el.style.top = y + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = '';
            el.classList.remove('dragging');
            if (onDragEnd) onDragEnd();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}
