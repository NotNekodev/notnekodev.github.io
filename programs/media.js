export function initMediaPlayer(container) {
    if (!container) return;

    const video = container.querySelector('#media-video');
    const fileInput = container.querySelector('#media-file-input');
    const openBtn = container.querySelector('#media-open-btn');
    if (!video || !fileInput) return;

    let currentObjectUrl = null;

    function loadFile(file) {
        if (!file) return;

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
        }

        const url = URL.createObjectURL(file);
        currentObjectUrl = url;
        video.src = url;
        video.play().catch(() => {
            // ignore autoplay errors
        });
    }

    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        loadFile(file);
    });

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    // Optional: allow drag & drop of video files into the window
    container.addEventListener('dragover', e => {
        e.preventDefault();
    });

    container.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            loadFile(file);
        }
    });

    // Cleanup object URL when window is removed
    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
