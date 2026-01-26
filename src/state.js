const DEFAULT_STATE = {
	wallpaper: 'assets/bg.png',
	defaultGradient: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
	icons: {}
};

export function loadDesktopState() {
	try {
		const saved = JSON.parse(localStorage.getItem('desktopState') || '{}');
		return {
			...DEFAULT_STATE,
			...saved,
			icons: saved.icons || {}
		};
	} catch {
		return { ...DEFAULT_STATE };
	}
}

/*
	Saves Icon Positions, Wallpaper Choice and Window Title Gradient

	-   Note I dropped the open window and window position saving for a few reasons,
		It was just impossible to repair given the current setup and it was taking up too
		much time
*/
export function saveDesktopState(_, icons = undefined, wallpaper = undefined, defaultGradient = undefined) {
	const state = loadDesktopState();

	if (icons !== undefined) state.icons = icons;
	if (wallpaper !== undefined) state.wallpaper = wallpaper;
	if (defaultGradient !== undefined) state.defaultGradient = defaultGradient;

	localStorage.setItem('desktopState', JSON.stringify(state));
}
