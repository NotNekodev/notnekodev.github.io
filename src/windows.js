import { loadDesktopState } from './state.js';
import { makeDraggable } from './draggables.js';
import { initSettings } from '../programs/settings.js';
import { initClock } from '../programs/clock.js';
import { initGame } from '../programs/game.js';
import { initSince } from '../programs/about.js';

const DEFAULT_SIZE = { width: 400, height: 300 };
const WINDOW_SIZES = {
	about: { width: 700, height: 800 },
	projects: { width: 600, height: 500 },
	contact: { width: 450, height: 350 },
	settings: { width: 300, height: 600 },
	clock: { width: 250, height: 280 },
	game: { width: 480, height: 250 },
};

const openWindows = [];
let topZ = 100;

function bringToFront(win) {
	if (!win) return;
	topZ += 1;
	win.style.zIndex = String(topZ);
}

export function getOpenWindows() {
	return openWindows;
}

export function createWindow(type, left, top, width, height, visible = true, gradient = null) {
	if (typeof type !== 'string') type = String(type);

	const windowsContainer = document.getElementById('windows');
	if (!windowsContainer) return null;

	// singleton windows
	const existing = openWindows.find(w => w.dataset.type === type);
	if (existing) {
		existing.style.display = 'block';
		bringToFront(existing);
		return existing;
	}

	const defaults = WINDOW_SIZES[type] || DEFAULT_SIZE;
	left ??= 100;
	top ??= 100;
	width ??= defaults.width;
	height ??= defaults.height;

	const win = document.createElement('div');
	win.className = 'window';
	win.dataset.type = type;
	win.style.position = 'absolute';
	win.style.left = left + 'px';
	win.style.top = top + 'px';
	win.style.width = width + 'px';
	win.style.height = height + 'px';
	win.style.display = visible ? 'block' : 'none';

	win.innerHTML = `
    <div class="window-header">
      ${type}<button class="window-close">x</button>
    </div>
    <div class="window-content">Loading...</div>
  `;

	windowsContainer.appendChild(win);
	openWindows.push(win);
	bringToFront(win);

	const header = win.querySelector('.window-header');
	const content = win.querySelector('.window-content');

	win.addEventListener('mousedown', () => bringToFront(win));

	const state = loadDesktopState();
	header.style.background = gradient ?? state.defaultGradient;

	makeDraggable(win);

	// draw close button
	header.querySelector('.window-close').addEventListener('click', () => {
		win.remove();
		const idx = openWindows.indexOf(win);
		if (idx > -1) openWindows.splice(idx, 1);
	});

	// Load content
	fetch(`programs/html/${encodeURIComponent(type)}.html`)
		.then(r => r.ok ? r.text() : `<div style="color:red">Failed to load ${type}.html</div>`)
		.then(html => {
			content.innerHTML = html;
			requestAnimationFrame(() => {
				if (type === 'settings') initSettings(content);
				if (type === 'clock') initClock(content);
				if (type === 'game') initGame(content);
				if (type === 'about') initSince(content);
			});
		})
		.catch(err => content.innerHTML = `<div style="color:red">${err}</div>`);

	return win;
}
