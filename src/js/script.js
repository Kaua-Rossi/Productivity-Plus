class Timer {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.running = false;
        this.interval = null;
    }

    set(h = 0, m = 0, s = 0) {
        this.hours = parseInt(h) || 0;
        this.minutes = parseInt(m) || 0;
        this.seconds = parseInt(s) || 0;
        this.updateDisplay();
        console.log(`Timer set to ${this.displayElement.textContent}`);
    }

    updateDisplay() {
        this.displayElement.textContent = String(this.hours).padStart(2, "0") + ":" + String(this.minutes).padStart(2, "0") + ":" + String(this.seconds).padStart(2, "0");
    }

    tick() {
        if (!this.running) return;

        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else if (this.hours > 0) {
            this.hours--;
            this.minutes = 59;
            this.seconds = 59;
        } else {
            console.log("Timer finished");
            this.running = false;
            return;
        }
        this.updateDisplay();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.interval = setInterval(() => this.tick(), 1000);
        console.log("Timer started");
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.interval);
        console.log("Timer paused");
    }

    reset() {
        this.pause();
        this.set(0, 0, 0);
        console.log("Timer reset");
    }
}

const timerDisplay = document.querySelector("#timer-display");
const mainTimer = new Timer(timerDisplay);

function setupSetTimerPopup() {
    const popup = document.querySelector("#timer-set-popup");
    const form = document.querySelector("#timer-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        popup.classList.add("hidden");
        mainTimer.set(document.querySelector("#hours").value, document.querySelector("#minutes").value, document.querySelector("#seconds").value);
    });

    window.showSetTimerPopup = function () {
        popup.classList.remove("hidden");
    };

    return;
}

setupSetTimerPopup();

document.querySelector("#set-time-button").addEventListener("click", () => showSetTimerPopup());
document.querySelector("#start-button").addEventListener("click", () => mainTimer.start());
document.querySelector("#stop-button").addEventListener("click", () => mainTimer.pause());
document.querySelector("#reset-button").addEventListener("click", () => mainTimer.reset());
