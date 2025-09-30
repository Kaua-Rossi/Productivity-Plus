class Timer {
    constructor(displayElement, stateText) {
        this.displayElement = displayElement;
        this.stateText = stateText;
        this.type = "timer";
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
        this.stateText.textContent = this.running ? "Running" : "Paused";
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
            this.pause();
            return;
        }
        this.updateDisplay();
    }

    start() {
        if (this.running || (this.hours === 0 && this.minutes === 0 && this.seconds === 0 && this.constructor === Timer)) return;
        this.running = true;
        this.interval = setInterval(() => this.tick(), 1000);
        console.log("Timer started");
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        this.updateDisplay();
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
    constructor(displayElement, stateText) {
        super(displayElement, stateText);
        this.type = "stopwatch";
    }

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

// falta adicionar a logica do descanso do pomodoro e também de mudar algumas coisinhas em relação aos outros timers.
class Pomodoro extends Timer {
    constructor(displayElement, stateText) {
        super(displayElement, stateText);
        this.type = "pomodoro";
        this.workMinutes = 25;
        this.breakMinutes = 5;
        this.bigBreakMinutes = 15;
        this.minutes = this.workMinutes;
        this.seconds = 0;
        this.pomodorosCompleted = 0;
        this.workSfx = new Audio("src/audio/breakFinishedSfx.mp3");
        this.breakSfx = new Audio("src/audio/breakReachedSfx.mp3");
        this.bigBreakSfx = new Audio("src/audio/bigBreakReachedSfx.mp3");
        this.working = true; // this indicates if currently in work period or break period
        this.running = false; // this indicates if the timer is running or paused
        this.interval = null;
    }

    set(wm = 0, bm = 0, bbm = 0) {
        this.pause();
        this.workMinutes = parseInt(wm) || 0;
        this.breakMinutes = parseInt(bm) || 0;
        this.bigBreakMinutes = parseInt(bbm) || 0;
        this.minutes = this.workMinutes;
        this.seconds = 0;
        this.updateDisplay();
        console.log(`Timer set to ${this.displayElement.textContent}`);
    }

    updateDisplay() {
        this.stateText.textContent = this.working ? "Work Time" : this.pomodorosCompleted % 4 === 0 ? "Big Break Time" : "Break Time";
        this.displayElement.textContent = String(this.minutes).padStart(2, "0") + ":" + String(this.seconds).padStart(2, "0");
    }

    tick() {
        if (!this.running) return;

        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else {
            if (this.working) {
                this.pomodorosCompleted++;
                console.log(`Pomodoro completed! Total completed: ${this.pomodorosCompleted}`);
                
                if (this.pomodorosCompleted % 4 === 0) {
                    this.bigBreakSfx.play();
                    this.minutes = this.bigBreakMinutes;
                } else {
                    this.breakSfx.play();
                    this.minutes = this.breakMinutes;
                }
            } else {
                this.workSfx.play();
                this.minutes = this.workMinutes;
            }
            this.working = !this.working;
            this.seconds = 0;
        }
        this.updateDisplay();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.interval = setInterval(() => this.tick(), 1000);
        console.log("Pomodoro started");
    }

    reset() {
        this.pause();
        this.workMinutes = 25;
        this.breakMinutes = 5;
        this.bigBreakMinutes = 15;
        this.minutes = this.workMinutes;
        this.working = true;
        this.seconds = 0;
        this.updateDisplay();
        console.log("Pomodoro reset");
    }
}

const timerDisplay = document.querySelector("#timer-display");
const stateText = document.querySelector("#state-text");

let mainTimer = null;

let timerTypeButtons = {
    timer: document.querySelector("#timer-button"),
    stopwatch: document.querySelector("#stopwatch-button"),
    pomodoro: document.querySelector("#pomodoro-button"),
    // flowmodoro: document.querySelector("#flowmodoro-button") (to be implemented)
};

let timerClasses = {
    timer: Timer,
    stopwatch: Stopwatch,
    pomodoro: Pomodoro,
    // flowmodoro: Flowmodoro (to be implemented)
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
    mainTimer = new TimerClass(timerDisplay, stateText);
    mainTimer.updateDisplay();

    for (let key in timerTypeButtons) {
        if (key === type) {
            timerTypeButtons[key].classList.add("active-timer-button");
            timerTypeButtons[key].classList.remove("inactive-timer-button");
        } else {
            timerTypeButtons[key].classList.remove("active-timer-button");
            timerTypeButtons[key].classList.add("inactive-timer-button");
        }
    }

    if (mainTimer.type === "stopwatch") {
        document.querySelector("#set-time-button").classList.add("hidden");
        document.querySelector("#set-time-button").classList.remove("inline-block");
    } else {
        document.querySelector("#set-time-button").classList.add("inline-block");
        document.querySelector("#set-time-button").classList.remove("hidden");
    }

    console.log(`Switched to ${type}`);
}

document.querySelector("#timer-button").addEventListener("click", () => switchTimerType("timer"));
document.querySelector("#stopwatch-button").addEventListener("click", () => switchTimerType("stopwatch"));
document.querySelector("#pomodoro-button").addEventListener("click", () => switchTimerType("pomodoro"));
// document.querySelector("#flowmodoro-button").addEventListener("click", () => switchTimerType("flowmodoro")); // (to be implemented)

switchTimerType("timer"); // default

function setupSetTimerPopup() {
    if (!mainTimer) {
        console.error("Main timer is not initialized.");
        return;
    }

    const popup = document.querySelector("#timer-set-popup");
    const formstd = document.querySelector("#timer-form");
    const formpomo = document.querySelector("#timer-form-pomodoro");
    // const formflow = document.querySelector("#timer-form-flowmodoro"); (to be implemented)

    formstd.addEventListener("submit", (e) => {
        e.preventDefault();
        popup.classList.add("hidden");
        mainTimer.set(document.querySelector("#hours").value, document.querySelector("#minutes").value, document.querySelector("#seconds").value);
    });

    formpomo.addEventListener("submit", (e) => {
        e.preventDefault();
        popup.classList.add("hidden");
        mainTimer.set(document.querySelector("#work-minutes").value, document.querySelector("#break-minutes").value, document.querySelector("#big-break-minutes").value);
    });

    // formflow.addEventListener("submit", (e) => { (to be implemented)

    window.showSetTimerPopup = function () {
        if (mainTimer.type === "timer") {
            formstd.classList.remove("hidden");
            formpomo.classList.add("hidden");
            // formflow.classList.add("hidden"); (to be implemented)
        } else if (mainTimer.type === "pomodoro") {
            formstd.classList.add("hidden");
            formpomo.classList.remove("hidden");
            // formflow.classList.add("hidden"); (to be implemented)
        } else if (mainTimer.type === "flowmodoro") {
            formstd.classList.add("hidden");
            formpomo.classList.add("hidden");
            // formflow.classList.remove("hidden"); (to be implemented)
        } else {
            console.log("No settings available for this timer type.");
            return;
        }

        popup.classList.remove("hidden");
    };

    return;
}

setupSetTimerPopup();

document.querySelector("#set-time-button").addEventListener("click", () => showSetTimerPopup());
document.querySelector("#start-button").addEventListener("click", () => mainTimer.start());
document.querySelector("#stop-button").addEventListener("click", () => mainTimer.pause());
document.querySelector("#reset-button").addEventListener("click", () => mainTimer.reset());

document.querySelector("#checklist-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.querySelector("#checklist-input");
    const taskText = input.value.trim();
    if (taskText === "") return;

    const checklistItem = document.createElement("div");
    checklistItem.classList.add("flex", "items-center", "mb-2", "bg-gray-800", "rounded", "p-2");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("mr-2", "ml-2", "w-4", "h-4", "accent-fuchsia-400");

    const span = document.createElement("span");
    span.classList.add("text-gray-50");
    span.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("ml-auto", "text-red-400", "hover:text-red-500", "font-bold", "text-lg", "focus:outline-none", "transition");
    deleteButton.addEventListener("click", () => {
        checklistItem.remove();
    });

    checklistItem.appendChild(checkbox);
    checklistItem.appendChild(span);
    checklistItem.appendChild(deleteButton);

    document.querySelector("#checklist-box").appendChild(checklistItem);
    input.value = "";
});
