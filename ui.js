function showApp() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";
}

function showError(msg) {
    alert(msg);
}

function showSuccess(msg = "Success") {
    console.log(msg);
}
function startClock() {
    const clock = document.getElementById("digital-clock");
    if (!clock) return;

    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "medium"
        });
    }, 1000);
}
function removeBlockingOverlays() {
    const ids = [
        "splash-screen",
        "loading-screen",
        "loading-overlay",
        "overlay",
        "particles-canvas"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
        }
    });

    // Safety: body ko clickable bana do
    document.body.style.pointerEvents = "auto";
}
