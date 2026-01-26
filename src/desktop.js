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

    // Taskbar clock (Europe/Berlin, 24-hour format)
    const clockContainer = document.getElementById('taskbar-clock');
    const clockTimeEl = document.getElementById('clock-time');
    const clockDateEl = document.getElementById('clock-date');
    if (clockTimeEl && clockDateEl) {
        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Europe/Berlin',
        });

        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Europe/Berlin',
        });

        function updateTaskbarClock() {
            const now = new Date();
            clockTimeEl.textContent = timeFormatter.format(now);
            clockDateEl.textContent = dateFormatter.format(now);
        }

        updateTaskbarClock();
        setInterval(updateTaskbarClock, 1000);
    }
    if (clockContainer) {
        clockContainer.title = 'Time for me – Europe/Berlin (24-hour)';
        clockContainer.style.cursor = 'pointer';
        clockContainer.addEventListener('click', () => {
            const win = createWindow('clock', 50, 50);
            addTaskbarButton(win);
        });
    }

    function addTaskbarButton(win) {
        if (!win) return;

        // Avoid duplicate taskbar buttons for the same window type
        const existingBtn = taskbar.querySelector(`.taskbar-window-btn[data-type="${win.dataset.type}"]`);
        if (existingBtn) return;

        const btn = document.createElement('button');
        btn.className = 'taskbar-window-btn';
        btn.dataset.type = win.dataset.type;
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
