export function initSince(container) {
    const el = container.querySelector("#since");
    if (!el) return;

    const start = new Date(el.dateTime);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    el.textContent = `${years} years ${months} months ${days} days`;
}