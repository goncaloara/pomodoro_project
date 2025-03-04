const musicPlayer = document.getElementById("musicPlayer");

let isRunning = false;
let isFocus = true;
let focusTime = 25 * 60;
let restTime = 5 * 60;
let timeLeft = focusTime;
let interval;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}

function updateDisplay() {
    document.getElementById("timeDisplay").innerText = formatTime(timeLeft);
    document.getElementById("timerTitle").innerText = isFocus ? 'Focus Time' : 'Rest Time';
}

function toggleTimer() {
    // Update times from inputs
    const newFocusTime = parseInt(document.getElementById("focusTimeInput").value, 10);
    const newRestTime = parseInt(document.getElementById("restTimeInput").value, 10);

    if (!isNaN(newFocusTime) && newFocusTime > 0) {
        focusTime = newFocusTime * 60;
    }
    if (!isNaN(newRestTime) && newRestTime > 0) {
        restTime = newRestTime * 60;
    }

    if (!isRunning) {
        if (!interval) { // First time starting, set timeLeft
            timeLeft = focusTime;
        }
        interval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                isFocus = !isFocus;
                timeLeft = isFocus ? focusTime : restTime;
                updateDisplay();
                toggleTimer(); // Automatically restart the next session
            } else {
                timeLeft--;
                updateDisplay();
            }
        }, 1000);
        document.getElementById("startButton").innerText = 'Pause';
        
        if (musicPlayer.paused) {
            musicPlayer.loop = true;
            musicPlayer.play().catch(error => {
                console.error("Autoplay failed:", error);
            });
        }
    } else {
        clearInterval(interval);
        interval = null;
        document.getElementById("startButton").innerText = 'Start';
        musicPlayer.pause();
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(interval);
    timeLeft = focusTime;
    updateDisplay();
    document.getElementById("startButton").innerText = 'Start';
    isRunning = false;
    musicPlayer.pause();
    musicPlayer.currentTime = 0;
}
