export function initMediaPlayer(container) {
    if (!container) return;

    const video = container.querySelector('#media-video');
    const fileInput = container.querySelector('#media-file-input');
    const openBtn = container.querySelector('#media-open-btn');
    const status = container.querySelector('#media-status');

    const playBtn = container.querySelector('#btn-play');
    const pauseBtn = container.querySelector('#btn-pause');
    const stopBtn = container.querySelector('#btn-stop');
    const seekBar = container.querySelector('#seek-bar');
    const volumeBar = container.querySelector('#volume-bar');
    const muteBtn = container.querySelector('#btn-mute');

    const coverArt = container.querySelector('#cover-art');
    const coverImg = container.querySelector('#cover-img');

    let currentObjectUrl = null;
    let seeking = false;
    let lastVolume = 1;

    video.controls = false;
    video.preload = 'metadata';

    function setStatus(text) {
        status.textContent = text;
    }

    function clearCoverArt() {
        coverImg.src = '';
        coverArt.style.display = 'none';
    }

    function loadCoverArt(file) {
        clearCoverArt();

        if (!file.type.startsWith('audio/')) return;

        // Browser can expose embedded artwork via mediaSession
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: file.name
            });
        }

        // Try to extract cover using HTMLAudioElement hack
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result]);
            const url = URL.createObjectURL(blob);
            coverImg.src = url;
            coverArt.style.display = 'block';
        };

        // This works for most MP3s with ID3 APIC
        reader.readAsArrayBuffer(file);
    }

    function loadFile(file) {
        if (!file) return;

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
        }

        currentObjectUrl = URL.createObjectURL(file);
        video.src = currentObjectUrl;
        video.currentTime = 0;

        clearCoverArt();

        if (file.type.startsWith('audio/')) {
            loadCoverArt(file);
            setStatus(`Playing audio: ${file.name}`);
        } else {
            setStatus(`Playing video: ${file.name}`);
        }

        video.play().catch(() => {});
    }

    openBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        loadFile(fileInput.files?.[0]);
    });

    playBtn.addEventListener('click', () => video.play().catch(() => {}));
    pauseBtn.addEventListener('click', () => video.pause());

    stopBtn.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        setStatus('Stopped');
    });

    video.addEventListener('loadedmetadata', () => {
        seekBar.max = Math.floor(video.duration || 0);
    });

    video.addEventListener('timeupdate', () => {
        if (!seeking) seekBar.value = Math.floor(video.currentTime);
    });

    seekBar.addEventListener('input', () => seeking = true);
    seekBar.addEventListener('change', () => {
        video.currentTime = Number(seekBar.value);
        seeking = false;
    });

    volumeBar.addEventListener('input', () => {
        video.volume = Number(volumeBar.value);
        if (video.volume > 0) {
            lastVolume = video.volume;
            muteBtn.textContent = '🔈';
        }
    });

    muteBtn.addEventListener('click', () => {
        if (video.volume > 0) {
            lastVolume = video.volume;
            video.volume = 0;
            volumeBar.value = 0;
            muteBtn.textContent = '🔇';
        } else {
            video.volume = lastVolume || 1;
            volumeBar.value = video.volume;
            muteBtn.textContent = '🔈';
        }
    });

    container.addEventListener('dragover', e => e.preventDefault());
    container.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) loadFile(file);
    });

    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
