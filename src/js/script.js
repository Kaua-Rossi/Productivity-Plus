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
        this.pause();
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
        clearInterval(this.interval);
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

class Stopwatch extends Timer {
    tick() {
        if (!this.running) return;

        this.seconds++;

        if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
        }
        if (this.minutes >= 60) {
            this.minutes = 0;
            this.hours++;
        }
        this.updateDisplay();
    }
}

const timerDisplay = document.querySelector("#timer-display");
let mainTimer;

let timerTypeButtons = {
    timer: document.querySelector("#timer-button"),
    stopwatch: document.querySelector("#stopwatch-button"),
    /*
    pomodoro: document.querySelector("#pomodoro-button"), (to be implemented)
    flowmodoro: document.querySelector("#flowmodoro-button") (to be implemented)
    */
};

let timerClasses = {
    timer: Timer,
    stopwatch: Stopwatch,
    /*
    pomodoro: Pomodoro, (to be implemented)
    flowmodoro: Flowmodoro (to be implemented)
    */
};

/**
 * Switches the active timer type to another one.
 * @param {string} type - The type of timer to switch to ("timer", "stopwatch", etc.).
 */
function switchTimerType(type) {
    if (mainTimer) {
        mainTimer.pause();
    }

    const TimerClass = timerClasses[type];
    if (!TimerClass) {
        console.error(`Timer type "${type}" is not implemented.`);
        return;
    }
    mainTimer = new TimerClass(timerDisplay);
    mainTimer.reset();

    for (let key in timerTypeButtons) {
        if (key === type) {
            timerTypeButtons[key].classList.add("active-timer-button");
            timerTypeButtons[key].classList.remove("inactive-timer-button");
        } else {
            timerTypeButtons[key].classList.remove("active-timer-button");
            timerTypeButtons[key].classList.add("inactive-timer-button");
        }
    }

    if (type === "timer") {
        document.querySelector("#set-time-button").classList.add("inline-block");
        document.querySelector("#set-time-button").classList.remove("hidden");
    } else {
        document.querySelector("#set-time-button").classList.add("hidden");
        document.querySelector("#set-time-button").classList.remove("inline-block");
    }

    console.log(`Switched to ${type}`);
}

document.querySelector("#timer-button").addEventListener("click", () => switchTimerType("timer"));
document.querySelector("#stopwatch-button").addEventListener("click", () => switchTimerType("stopwatch"));
document.querySelector("#pomodoro-button").addEventListener("click", () => switchTimerType("pomodoro")); // (to be implemented)
document.querySelector("#flowmodoro-button").addEventListener("click", () => switchTimerType("flowmodoro")); // (to be implemented)

switchTimerType("timer"); // default

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
