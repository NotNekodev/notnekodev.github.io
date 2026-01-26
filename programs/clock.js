export function initClock(container) {
    if (!container) return;

    const hourHand = container.querySelector('#hour-hand');
    const minuteHand = container.querySelector('#minute-hand');
    const secondHand = container.querySelector('#second-hand');
    if (!hourHand || !minuteHand || !secondHand) return;

    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        hourHand.style.transform = `rotate(${(hours + minutes / 60) * 30}deg)`;
        minuteHand.style.transform = `rotate(${(minutes + seconds / 60) * 6}deg)`;
        secondHand.style.transform = `rotate(${seconds * 6}deg)`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}
