import { saveDesktopState, loadDesktopState } from '../src/state.js';
import { getOpenWindows } from '../src/windows.js';

export function initSettings(containerDiv) {
    if (!containerDiv) return;

    const select = containerDiv.querySelector('#wallpaper-select');
    const preview = containerDiv.querySelector('#wallpaper-preview');
    const applyBtn = containerDiv.querySelector('#apply-wallpaper');

    const gradSelect = containerDiv.querySelector('#gradient-select');
    const gradColor1 = containerDiv.querySelector('#grad-color1');
    const gradColor2 = containerDiv.querySelector('#grad-color2');
    const gradAngle = containerDiv.querySelector('#grad-angle');
    const gradPreview = containerDiv.querySelector('#gradient-preview');
    const applyGradBtn = containerDiv.querySelector('#apply-gradient');

    const state = loadDesktopState();

    const wallpapers = ['assets/bg.png', 'assets/bg1.png', 'assets/bg2.png'];
    const currentWallpaper = state.wallpaper && wallpapers.includes(state.wallpaper)
        ? state.wallpaper
        : wallpapers[0];

    select.value = currentWallpaper;
    preview.innerHTML = `<img src="${currentWallpaper}" style="width:100%; height:100%; object-fit:cover;">`;

    select.addEventListener('change', () => {
        preview.innerHTML = `<img src="${select.value}" style="width:100%; height:100%; object-fit:cover;">`;
    });

    applyBtn.addEventListener('click', () => {
        const wallpaperPath = select.value;
        const desktop = document.getElementById('desktop');
        if (desktop) desktop.style.background = `url('${wallpaperPath}') repeat`;
        state.wallpaper = wallpaperPath;
        saveDesktopState(undefined, undefined, wallpaperPath, undefined);
    });

    const defaultGradient = state.defaultGradient || 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)';
    gradPreview.style.background = defaultGradient;

    const parsed = parseGradient(defaultGradient);
    if (parsed) {
        gradColor1.value = parsed.top;
        gradColor2.value = parsed.bottom;
        gradAngle.value = parsed.angle;
    }

    function updatePreview() {
        const gradient = `linear-gradient(${gradAngle.value}deg, ${gradColor1.value} 0%, ${gradColor2.value} 100%)`;
        gradPreview.style.background = gradient;
        return gradient;
    }

    gradColor1.addEventListener('input', updatePreview);
    gradColor2.addEventListener('input', updatePreview);
    gradAngle.addEventListener('input', updatePreview);

    gradSelect.addEventListener('change', () => {
        if (gradSelect.value === 'custom') return;
        const preset = parseGradient(gradSelect.value);
        if (preset) {
            gradColor1.value = preset.top;
            gradColor2.value = preset.bottom;
            gradAngle.value = preset.angle;
            gradPreview.style.background = gradSelect.value;
        }
    });

    applyGradBtn.addEventListener('click', () => {
        const gradient = updatePreview();
        state.defaultGradient = gradient;

        // Apply Gradient
        const windows = getOpenWindows();
        windows.forEach(win => {
            const header = win.querySelector('.window-header');
            if (header) header.style.background = gradient;
        });

        // Save Gradient
        saveDesktopState(windows, undefined, undefined, gradient);
    });
}

function parseGradient(str) {
    const match = str.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]{6})\s*0%,\s*(#[0-9a-fA-F]{6})\s*100%\)/);
    if (!match) return null;
    return { angle: match[1], top: match[2], bottom: match[3] };
}
