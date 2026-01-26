export function initClock(container) {
    if (!container) return;

    const hourHand = container.querySelector('#hour-hand');
    const minuteHand = container.querySelector('#minute-hand');
    const secondHand = container.querySelector('#second-hand');
    if (!hourHand || !minuteHand || !secondHand) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });

    function updateClock() {
        const parts = formatter.formatToParts(new Date());

        let hours, minutes, seconds;
        for (const p of parts) {
            if (p.type === 'hour') hours = Number(p.value);
            if (p.type === 'minute') minutes = Number(p.value);
            if (p.type === 'second') seconds = Number(p.value);
        }

        const h12 = hours % 12;

        hourHand.style.transform =
            `rotate(${(h12 + minutes / 60) * 30}deg)`;
        minuteHand.style.transform =
            `rotate(${(minutes + seconds / 60) * 6}deg)`;
        secondHand.style.transform =
            `rotate(${seconds * 6}deg)`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}
