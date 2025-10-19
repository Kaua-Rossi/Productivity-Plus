import { Timer, Stopwatch, Pomodoro } from "./timers.js";
import { ChecklistManager } from "./checklist.js";

class ProductivityApp {
    constructor() {
        this.displayElement = document.querySelector("#timer-display");
        this.stateTextElement = document.querySelector("#state-text");
        this.mainTimer = null;
        this.checklistManager = null;

        this.timerClasses = {
            timer: Timer,
            stopwatch: Stopwatch,
            pomodoro: Pomodoro,
            // flowmodoro: Flowmodoro,
        };

        this.timerTypeButtons = {
            timer: document.querySelector("#timer-button"),
            stopwatch: document.querySelector("#stopwatch-button"),
            pomodoro: document.querySelector("#pomodoro-button"),
            flowmodoro: document.querySelector("#flowmodoro-button"),
        };
    }

    init() {
        this.setupTimerControls();
        this.setupSetTimerPopup();
        this.switchTimerType("timer");

        this.checklistManager = new ChecklistManager("#checklist-form", "#checklist-input", "#checklist-box", "checklistTasks");
        this.checklistManager.init();
    }

    setupTimerControls() {
        for (const type in this.timerTypeButtons) {
            this.timerTypeButtons[type].addEventListener("click", () => this.switchTimerType(type));
        }

        document.querySelector("#start-button").addEventListener("click", () => {
            if (
                this.mainTimer.seconds === 0 &&
                this.mainTimer.minutes === 0 &&
                this.mainTimer.hours === 0 &&
                this.mainTimer.type !== "stopwatch" /*&& this.mainTimer.type !== "flowmodoro"*/
            )
                return;
            this.mainTimer.start();
        });

        document.querySelector("#stop-button").addEventListener("click", () => this.mainTimer.pause());
        document.querySelector("#reset-button").addEventListener("click", () => this.mainTimer.reset());
    }

    switchTimerType(type) {
        if (this.mainTimer) {
            this.mainTimer.pause();
        }

        const TimerClass = this.timerClasses[type];

        if (!TimerClass) {
            console.error(`Timer type "${type}" is not implemented.`);
            return;
        }

        this.mainTimer = new TimerClass(this.displayElement, this.stateTextElement);
        this.mainTimer.updateDisplay();

        for (let key in this.timerTypeButtons) {
            const button = this.timerTypeButtons[key];
            if (key === type) {
                button.classList.add("active-timer-button");
                button.classList.remove("inactive-timer-button");
            } else {
                button.classList.remove("active-timer-button");
                button.classList.add("inactive-timer-button");
            }
        }

        console.log(`Switched to ${type}`);
    }

    setupSetTimerPopup() {
        const popup = document.querySelector("#timer-set-popup");
        const formstd = document.querySelector("#timer-form");
        const formpomo = document.querySelector("#timer-form-pomodoro");
        const setTimeButton = document.querySelector("#set-time-button");

        const handleSubmit = (e) => {
            e.preventDefault();
            popup.classList.add("hidden");
            if (this.mainTimer.type === "timer") {
                this.mainTimer.set(document.querySelector("#hours").value, document.querySelector("#minutes").value, document.querySelector("#seconds").value);
            } else if (this.mainTimer.type === "pomodoro") {
                this.mainTimer.set(
                    document.querySelector("#work-minutes").value,
                    document.querySelector("#break-minutes").value,
                    document.querySelector("#big-break-minutes").value,
                );
            }
        };

        formstd.addEventListener("submit", handleSubmit);
        formpomo.addEventListener("submit", handleSubmit);

        setTimeButton.addEventListener("click", () => {
            if (this.mainTimer.type === "timer") {
                formstd.classList.remove("hidden");
                formpomo.classList.add("hidden");
            } else if (this.mainTimer.type === "pomodoro") {
                formstd.classList.add("hidden");
                formpomo.classList.remove("hidden");
            } else {
                return;
            }
            popup.classList.remove("hidden");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new ProductivityApp();
    app.init();
});
