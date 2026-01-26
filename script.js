const icons = document.querySelectorAll('.icon');
const windowsContainer = document.getElementById('windows');
const taskbarWindows = document.getElementById('taskbar-windows');
let openWindows = [];

function getTopColorFromGradient(gradient) {
  const m = gradient.match(/linear-gradient\(\d+deg,\s*(#[0-9a-fA-F]+)\s*0%,\s*#[0-9a-fA-F]+\s*100%\)/);
  return m ? m[1] : '#2563eb';
}

function startClock() {
  const clock = document.getElementById('taskbar-clock');
  if (!clock) return;
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const day = now.getDate().toString().padStart(2,'0');
    const month = (now.getMonth()+1).toString().padStart(2,'0');
    const year = now.getFullYear();

    const timeText = `${hours}:${minutes}`;
    const dateText = `${day}/${month}/${year}`;

    const timeDiv = document.getElementById('clock-time');
    const dateDiv = document.getElementById('clock-date');

    if (timeDiv && dateDiv) {
      timeDiv.textContent = timeText;
      dateDiv.textContent = dateText;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('desktopState');
  let wallpaperSet = false;
  let defaultGradient = 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)';

  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (state.wallpaper) {
        document.body.style.background = `url('assets/${state.wallpaper}') repeat`;
        wallpaperSet = true;
      }
      if (state.defaultGradient) defaultGradient = state.defaultGradient;
      if (Array.isArray(state.openWindows)) {
        state.openWindows.forEach(w => {
          createWindow(w.type, w.left, w.top, w.width, w.height, w.minimized, w.gradient || defaultGradient);
        });
      }
    } catch {}
  }

  const taskbar = document.getElementById('taskbar');
  if (taskbar) taskbar.style.background = defaultGradient;

  if (!wallpaperSet) {
    let wallpaper = null;
    const bg = document.body.style.background;
    const match = bg.match(/assets\/(bg\d?\.png)/);
    if (match) wallpaper = match[1];
    if (wallpaper) {
      const state = saved ? JSON.parse(saved) : {};
      state.wallpaper = wallpaper;
      localStorage.setItem('desktopState', JSON.stringify(state));
    }
  }

  if (!saved || (JSON.parse(saved).openWindows || []).length === 0) {
    createWindow('about', 1000, 50, 600, 800, false, defaultGradient);
  }

  startClock();
});

const windowContents = {
  about: { title: 'About Me', file: 'about.html', defaultSize: { width: 1000, height: 800 } },
  projects: { title: 'Projects', file: 'projects.html', defaultSize: { width: 600, height: 500 } },
  contact: { title: 'Contact', file: 'contact.html', defaultSize: { width: 400, height: 400 } },
  settings: { title: 'Settings', file: 'settings.html', isSettings: true, defaultSize: { width: 340, height: 260 } },
};

function createWindow(type, left, top, width, height, minimized, gradient) {
  const win = document.createElement('div');
  win.className = 'window';
  win.innerHTML = `
    <div class="window-header">
      <span>${windowContents[type].title}</span>
      <button class="window-close">✕</button>
    </div>
    <div class="window-content">Loading...</div>
  `;
  if (arguments.length <= 1 && windowContents[type].defaultSize) {
    win.style.width = windowContents[type].defaultSize.width + 'px';
    win.style.height = windowContents[type].defaultSize.height + 'px';
  }
  windowsContainer.appendChild(win);
  makeDraggable(win);

  const header = win.querySelector('.window-header');
  header.style.background = gradient || document.getElementById('taskbar')?.style.background || 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)';

  const winId = Date.now() + Math.random();
  win.dataset.winId = winId;
  if (arguments.length > 1) {
    if (typeof left === 'number') win.style.left = left + 'px';
    if (typeof top === 'number') win.style.top = top + 'px';
    if (typeof width === 'number') win.style.width = width + 'px';
    if (typeof height === 'number') win.style.height = height + 'px';
    if (minimized) win.style.display = 'none';
  }

  openWindows.push({ id: winId, type, win, gradient: header.style.background });
  updateTaskbar();
  focusWindow(win);

  win.querySelector('.window-close').onclick = () => {
    win.remove();
    openWindows = openWindows.filter(w => w.id !== winId);
    updateTaskbar();
    saveDesktopState();
  };

  win.addEventListener('mousedown', () => focusWindow(win));
  const observer = new MutationObserver(saveDesktopState);
  observer.observe(win, { attributes: true, attributeFilter: ['style'] });

  const contentDiv = win.querySelector('.window-content');
  if (windowContents[type].file) {
    fetch(windowContents[type].file)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(html => {
        contentDiv.innerHTML = html;
        if (windowContents[type].isSettings) {
          const select = contentDiv.querySelector('#wallpaper-select');
          const preview = contentDiv.querySelector('#wallpaper-preview');
          const applyBtn = contentDiv.querySelector('#apply-wallpaper');

          const gradSelect = contentDiv.querySelector('#gradient-select');
          const gradColor1 = contentDiv.querySelector('#grad-color1');
          const gradColor2 = contentDiv.querySelector('#grad-color2');
          const gradAngle = contentDiv.querySelector('#grad-angle');
          const gradPreview = contentDiv.querySelector('#gradient-preview');
          const applyGradBtn = contentDiv.querySelector('#apply-gradient');

          const savedState = localStorage.getItem('desktopState');
          let state = savedState ? JSON.parse(savedState) : {};

          // Wallpaper preview
          const bgMatch = document.body.style.background.match(/assets\/(bg\d?\.png)/);
          const currentWallpaper = bgMatch ? bgMatch[1] : 'bg.png';
          if (select) select.value = currentWallpaper;
          if (preview) preview.innerHTML = `<img src='assets/${currentWallpaper}' style='width:100%; height:100%; object-fit:cover;'>`;
          select.addEventListener('change', () => {
            preview.innerHTML = `<img src='assets/${select.value}' style='width:100%; height:100%; object-fit:cover;'>`;
          });
          applyBtn.addEventListener('click', () => {
            document.body.style.background = `url('assets/${select.value}') repeat`;
            state.wallpaper = select.value;
            localStorage.setItem('desktopState', JSON.stringify(state));
          });

          // Gradient settings
          const presets = Array.from(gradSelect.options).map(opt => opt.value);
          let currentGradient = state.defaultGradient || header.style.background;
          const parseGradient = g => {
            const m = g.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]+)\s*0%,\s*(#[0-9a-fA-F]+)\s*100%\)/);
            if (m) return { angle: m[1], top: m[2], bottom: m[3] };
            return null;
          };
          const parsed = parseGradient(currentGradient);
          if (parsed) {
            gradAngle.value = parsed.angle;
            gradColor1.value = parsed.top;
            gradColor2.value = parsed.bottom;
          }
          gradPreview.style.background = currentGradient;
          if (presets.includes(currentGradient)) gradSelect.value = currentGradient;
          else {
            if (!gradSelect.querySelector('option[value="custom"]')) {
              const opt = document.createElement('option');
              opt.value = "custom";
              opt.textContent = "Custom Gradient";
              gradSelect.appendChild(opt);
            }
            gradSelect.value = "custom";
          }

          const updatePreview = () => {
            const gradient = `linear-gradient(${gradAngle.value}deg, ${gradColor1.value} 0%, ${gradColor2.value} 100%)`;
            gradPreview.style.background = gradient;
            if (presets.includes(gradient)) gradSelect.value = gradient;
            else gradSelect.value = "custom";
          };

          gradColor1.addEventListener('input', updatePreview);
          gradColor2.addEventListener('input', updatePreview);
          gradAngle.addEventListener('input', updatePreview);

          gradSelect.addEventListener('change', () => {
            const value = gradSelect.value;
            if (value === "custom") return;
            const parsedPreset = parseGradient(value);
            if (parsedPreset) {
              gradAngle.value = parsedPreset.angle;
              gradColor1.value = parsedPreset.top;
              gradColor2.value = parsedPreset.bottom;
              gradPreview.style.background = value;
            }
          });

          applyGradBtn.addEventListener('click', () => {
            const gradient = `linear-gradient(${gradAngle.value}deg, ${gradColor1.value} 0%, ${gradColor2.value} 100%)`;
            document.querySelectorAll('.window-header').forEach(h => {
              h.style.background = gradient;
              const w = openWindows.find(w => w.win.querySelector('.window-header') === h);
              if (w) w.gradient = gradient;
            });
            const taskbar = document.getElementById('taskbar');
            if (taskbar) taskbar.style.background = gradient;

            const topColor = getTopColorFromGradient(gradient);
            document.querySelectorAll('.taskbar-window-btn').forEach(btn => {
              btn.style.background = topColor;
              btn.style.color = '#fff';
              btn.style.border = '2px solid #888';
            });

            state.defaultGradient = gradient;
            localStorage.setItem('desktopState', JSON.stringify(state));
            saveDesktopState();
          });
        }
      })
      .catch(() => {
        contentDiv.innerHTML = '<div style="color:red">Failed to load content.</div>';
      });
  }
  saveDesktopState();
}

function updateTaskbar() {
  taskbarWindows.innerHTML = '';
  const taskbarGradient = document.getElementById('taskbar')?.style.background;
  openWindows.forEach(({ id, type, win, gradient }) => {
    const btn = document.createElement('button');
    btn.className = 'taskbar-window-btn' + (win.style.display !== 'none' ? ' active' : '');
    btn.textContent = windowContents[type].title;
    const topColor = getTopColorFromGradient(gradient || taskbarGradient);
    btn.style.background = topColor;
    btn.style.color = '#fff';
    btn.style.border = '2px solid #888';
    btn.onclick = () => {
      if (win.style.display === 'none') {
        win.style.display = '';
        focusWindow(win);
        btn.classList.add('active');
      } else {
        win.style.display = 'none';
        btn.classList.remove('active');
      }
      saveDesktopState();
    };
    taskbarWindows.appendChild(btn);
  });
}

function saveDesktopState() {
  let wallpaper = null;
  const bg = document.body.style.background;
  const match = bg.match(/assets\/(bg\d?\.png)/);
  if (match) wallpaper = match[1];

  const state = {
    wallpaper,
    defaultGradient: document.getElementById('taskbar')?.style.background || 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
    openWindows: openWindows.map(({ type, win, gradient }) => ({
      type,
      left: parseInt(win.style.left) || win.offsetLeft,
      top: parseInt(win.style.top) || win.offsetTop,
      width: parseInt(win.style.width) || win.offsetWidth,
      height: parseInt(win.style.height) || win.offsetHeight,
      minimized: win.style.display === 'none',
      gradient
    }))
  };
  localStorage.setItem('desktopState', JSON.stringify(state));
}

function focusWindow(win) {
  document.querySelectorAll('.window').forEach(w => w.style.zIndex = 10);
  win.style.zIndex = 1000;
  const winId = win.dataset.winId;
  Array.from(taskbarWindows.children).forEach(btn => {
    btn.classList.remove('active');
    if (openWindows.find(w => w.id == winId && w.win === win)) btn.classList.add('active');
  });
}

icons.forEach(icon => {
  icon.addEventListener('click', e => {
    e.stopPropagation();
    icons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });
  icon.addEventListener('dblclick', () => {
    createWindow(icon.dataset.window);
    icon.classList.remove('selected');
  });
});

document.addEventListener('click', () => {
  icons.forEach(i => i.classList.remove('selected'));
});

function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let offsetX, offsetY, isDragging = false;
  header.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = 100 + Date.now();
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    win.style.left = e.clientX - offsetX + 'px';
    win.style.top = e.clientY - offsetY + 'px';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}
