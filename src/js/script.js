let timerRunning = false;

function setTimerPopup() {
    document.querySelector("#timer-set-popup").classList.remove("hidden");
    document.querySelector("#timer-form").addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelector("#timer-set-popup").classList.add("hidden");
        setTimer(document.querySelector("#hours").value, document.querySelector("#minutes").value, document.querySelector("#seconds").value);
    });
    return;
}

function setTimer(hours = 0, minutes = 0, seconds = 0) {
    try {
        if (isNaN(parseInt(hours))) throw "Invalid hours";
        if (isNaN(parseInt(minutes))) throw "Invalid minutes";
        if (isNaN(parseInt(seconds))) throw "Invalid seconds";
    } catch (e) {
        console.error(e);
        return false;
    }

    let timerDisplay = document.querySelector("#timer-display");
    timerDisplay.textContent = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    console.log(`Timer set to ${timerDisplay.textContent}`);
    return true;
}

function timerSetStatus(bool) {
    if (typeof bool !== "boolean") {
        console.error("Invalid argument: not a boolean");
        return false;
    }
    timerRunning = bool;
    console.log(`Timer running status set to ${timerRunning}`);
    return true;
}

function timerTick() {
    if (!timerRunning) return;

    let timerDisplay = document.querySelector("#timer-display");
    let hours, minutes, seconds;
    hours = parseInt(timerDisplay.textContent.split(":")[0]);
    minutes = parseInt(timerDisplay.textContent.split(":")[1]);
    seconds = parseInt(timerDisplay.textContent.split(":")[2]);

    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0) {
        minutes--;
        seconds = 59;
    } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
    } else {
        // Timer finished
        console.log("Timer finished");
        timerSetStatus(false);
        return;
    }
    timerDisplay.textContent = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

setInterval(timerTick, 1000);

function timerReset() {
    setTimer(0, 0, 0);
    timerSetStatus(false);
    console.log("Timer reset");
    return true;
}
