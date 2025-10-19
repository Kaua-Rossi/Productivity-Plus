export class Timer {
    constructor(displayElement, stateTextElement) {
        this.displayElement = displayElement; // Where's the time shown
        this.stateTextElement = stateTextElement; // A text to show the current state of the timer (e.g., "Running", "Paused", etc.)
        this.type = "timer"; // Type of timer (e.g., "timer", "stopwatch", etc.)
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
        this.running = false;
        this.interval = null; // To hold the setInterval reference
        this.timerSfx = new Audio("src/audio/timerFinishedSfx.mp3");
    }

    updateDisplay() {
        this.stateTextElement.textContent = this.running ? "Running" : "Paused";
        this.displayElement.textContent =
            String(this.hours).padStart(2, "0") +
            ":" +
            String(this.minutes).padStart(2, "0") +
            ":" +
            String(this.seconds).padStart(2, "0") +
            ":" +
            String(this.milliseconds).padStart(2, "0");
    }

    set(h = 0, m = 0, s = 0) {
        this.hours = parseInt(h) || 0;
        this.minutes = parseInt(m) || 0;
        this.seconds = parseInt(s) || 0;
        this.milliseconds = 0;
        this.updateDisplay();
        console.log(`${this.type} set to ${this.displayElement.textContent}`);
    }

    tick() {
        if (!this.running) return;
        if (this.milliseconds > 0) {
            this.milliseconds--;
        } else if (this.seconds > 0) {
            this.seconds--;
            this.milliseconds = 99;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
            this.milliseconds = 99;
        } else if (this.hours > 0) {
            this.hours--;
            this.minutes = 59;
            this.seconds = 59;
            this.milliseconds = 99;
        } else {
            this.timerSfx.play();
            this.pause();
            console.log(`${this.type} finished`);
            return;
        }
        this.updateDisplay();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.interval = setInterval(() => this.tick(), 10);
        console.log(`${this.type} started`);
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.interval);
        this.updateDisplay();
        console.log(`${this.type} paused`);
    }

    reset() {
        this.pause();
        this.set(0, 0, 0);
        console.log(`${this.type} reset`);
    }
}

export class Stopwatch extends Timer {
    constructor(displayElement, stateTextElement) {
        super(displayElement, stateTextElement);
        this.type = "stopwatch";
    }

    tick() {
        if (!this.running) return;

        this.milliseconds++;

        if (this.milliseconds >= 100) {
            this.milliseconds = 0;
            this.seconds++;
        } else if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
        } else if (this.minutes >= 60) {
            this.minutes = 0;
            this.hours++;
        }
        this.updateDisplay();
    }
}

export class Pomodoro extends Timer {
    constructor(displayElement, stateTextElement) {
        super(displayElement, stateTextElement);
        this.type = "pomodoro";
        this.workMinutes = 25;
        this.breakMinutes = 5;
        this.bigBreakMinutes = 15;
        this.minutes = this.workMinutes;
        this.seconds = 0;
        this.milliseconds = 0;
        this.pomodorosCompleted = 0;
        this.workSfx = new Audio("src/audio/breakFinishedSfx.mp3");
        this.breakSfx = new Audio("src/audio/breakReachedSfx.mp3");
        this.bigBreakSfx = new Audio("src/audio/bigBreakReachedSfx.mp3");
        this.working = true;
    }

    set(wm = 0, bm = 0, bbm = 0) {
        this.workMinutes = parseInt(wm) || 0;
        this.breakMinutes = parseInt(bm) || 0;
        this.bigBreakMinutes = parseInt(bbm) || 0;
        this.minutes = this.workMinutes;
        this.seconds = 0;
        this.milliseconds = 0;
        this.working = true;
        this.updateDisplay();
        console.log(`${this.type} set to ${this.displayElement.textContent}`);
    }

    updateDisplay() {
        this.stateTextElement.textContent = this.working ? "Work Time" : this.pomodorosCompleted % 4 === 0 ? "Big Break Time" : "Break Time";
        this.displayElement.textContent = String(this.minutes).padStart(2, "0") + ":" + String(this.seconds).padStart(2, "0") + ":" + String(this.milliseconds).padStart(2, "0");
    }

    tick() {
        if (!this.running) return;

        if (this.milliseconds > 0) {
            this.milliseconds--;
        } else if (this.seconds > 0) {
            this.seconds--;
            this.milliseconds = 99;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
            this.milliseconds = 99;
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
            this.milliseconds = 0;
            this.pause();
        }
        this.updateDisplay();
    }

    reset() {
        this.pause();
        this.set(25, 5, 15);
        this.updateDisplay();
        console.log(`${this.type} reset`);
    }
}
