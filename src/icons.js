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

	let autoRow = 0;
	let autoCol = 0;

	const occupiedBy = new Map();

	function coordKey(col, row) {
		return `${col},${row}`;
	}

	function placeIconAtGrid(icon, id, preferredCol, preferredRow) {
		let col = preferredCol;
		let row = preferredRow;

		while (occupiedBy.has(coordKey(col, row))) {
			row++;
			if (row >= maxRows) {
				row = 0;
				col++;
			}
		}

		const left = startX + col * spacingX;
		const top = startY + row * spacingY;

		icon.style.left = left + 'px';
		icon.style.top = top + 'px';
		iconsState[id] = { left, top };
		icon.dataset.gridCol = String(col);
		icon.dataset.gridRow = String(row);
		occupiedBy.set(coordKey(col, row), icon);
	}

	icons.forEach(icon => {
		const id = icon.dataset.window;
		icon.style.width = iconSize + 'px';
		icon.style.height = iconSize + 'px';
		icon.style.position = 'absolute';

		const tooltip = icon.querySelector('.icon-tooltip');
		if (tooltip) {
			function updateTooltipPosition(e) {
				let x = e.clientX + 12;
				let y = e.clientY + 12;

				const maxX = window.innerWidth - tooltip.offsetWidth - 4;
				const maxY = window.innerHeight - tooltip.offsetHeight - 4;

				if (x > maxX) x = maxX;
				if (y > maxY) y = maxY;
				if (x < 0) x = 0;
				if (y < 0) y = 0;

				tooltip.style.left = x + 'px';
				tooltip.style.top = y + 'px';
			}

			icon.addEventListener('mouseenter', e => {
				tooltip.style.display = 'block';
				updateTooltipPosition(e);
			});

			icon.addEventListener('mousemove', e => {
				tooltip.style.display = 'block';
				updateTooltipPosition(e);
			});

			icon.addEventListener('mouseleave', () => {
				tooltip.style.display = 'none';
			});

			icon.addEventListener('mousedown', () => {
				tooltip.style.display = 'none';
			});
		}

		icon.addEventListener('click', () => {
			icons.forEach(i => i.classList.remove('selected'));
			icon.classList.add('selected');
		});

		if (iconsState[id]) {
			let col = Math.round((iconsState[id].left - startX) / spacingX);
			let row = Math.round((iconsState[id].top - startY) / spacingY);

			if (col < 0) col = 0;
			if (row < 0) row = 0;

			placeIconAtGrid(icon, id, col, row);
		} else {
			placeIconAtGrid(icon, id, autoCol, autoRow);
			autoRow++;
			if (autoRow >= maxRows) { autoRow = 0; autoCol++; }
		}

		let offsetX = 0;
		let offsetY = 0;

		icon.addEventListener('mousedown', e => {
			e.preventDefault();
			offsetX = e.clientX - icon.offsetLeft;
			offsetY = e.clientY - icon.offsetTop;

			document.body.style.userSelect = 'none';

			function onMouseMove(e) {
				icon.style.left = e.clientX - offsetX + 'px';
				icon.style.top = e.clientY - offsetY + 'px';
			}

			function onMouseUp(e) {
				let rawLeft = e.clientX - offsetX;
				let rawTop = e.clientY - offsetY;

				let col = Math.round((rawLeft - startX) / spacingX);
				let row = Math.round((rawTop - startY) / spacingY);

				if (col < 0) col = 0;
				if (row < 0) row = 0;

				const prevCol = Number(icon.dataset.gridCol);
				const prevRow = Number(icon.dataset.gridRow);
				if (!Number.isNaN(prevCol) && !Number.isNaN(prevRow)) {
					const prevKey = coordKey(prevCol, prevRow);
					const existing = occupiedBy.get(prevKey);
					if (existing === icon) {
						occupiedBy.delete(prevKey);
					}
				}

				while (occupiedBy.has(coordKey(col, row))) {
					row++;
					if (row >= maxRows) {
						row = 0;
						col++;
					}
				}

				const finalLeft = startX + col * spacingX;
				const finalTop = startY + row * spacingY;

				icon.style.left = finalLeft + 'px';
				icon.style.top = finalTop + 'px';

				icon.dataset.gridCol = String(col);
				icon.dataset.gridRow = String(row);
				occupiedBy.set(coordKey(col, row), icon);

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
