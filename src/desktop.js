import { createWindow } from './windows.js';
import { makeIconsDraggable } from './icons.js';
import { loadDesktopState } from './state.js';

export function initDesktop() {
    const icons = document.querySelectorAll('.icon');
    const taskbar = document.getElementById('taskbar-windows');
    const startBtn = document.getElementById('start-btn');
    const state = loadDesktopState();

    // Wallpaper
    document.body.style.background = state.wallpaper
        ? `url('${state.wallpaper}') repeat`
        : 'linear-gradient(#111, #222)';

    // Start about window
    const aboutWin = createWindow('about', 900, 50);
    addTaskbarButton(aboutWin);

    // double-click input action opens windows
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const win = createWindow(icon.dataset.window, 50, 50);
            addTaskbarButton(win);
        });
    });

    makeIconsDraggable();

    startBtn.onclick = () => alert('Start menu placeholder');

    function addTaskbarButton(win) {
        if (!win) return;
        const btn = document.createElement('button');
        btn.className = 'taskbar-window-btn';
        btn.textContent = win.dataset.type;
        taskbar.appendChild(btn);

        btn.onclick = () => {
            win.style.display = win.style.display === 'none' ? 'block' : 'none';
        };

        const observer = new MutationObserver(() => {
            if (!document.body.contains(win)) {
                btn.remove();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}
