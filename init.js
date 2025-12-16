document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("DOMContentLoaded", () => {
    removeBlockingOverlays();  
});

    const splashScreen = document.getElementById("splash-screen");
    const loginScreen = document.getElementById("login-screen");

    if (splashScreen) {
        splashScreen.addEventListener("click", () => {
            splashScreen.style.opacity = "0";
            setTimeout(() => {
                splashScreen.style.display = "none";
                loginScreen.style.display = "block";
            }, 400);
        });
    }

    /* ---------------- AUTH ---------------- */
    let isRegister = false;

const toggleAuthBtn = document.getElementById("toggle-auth-btn");
const loginBtn = document.getElementById("login-btn");

toggleAuthBtn.addEventListener("click", () => {
    isRegister = !isRegister;

    document.getElementById("registration-fields").style.display =
        isRegister ? "block" : "none";

    loginBtn.textContent = isRegister ? "REGISTER" : "LOGIN";
});

loginBtn.addEventListener("click", async () => {
    try {
        if (isRegister) {
            await handleRegister();   // 👈 THIS WAS NOT FIRING
        } else {
            await loginUser(
                document.getElementById("username").value.trim(),
                document.getElementById("password").value.trim()
            );
            showApp();
        }
    } catch (err) {
        alert(err.message || "Auth failed");
    }
});


    /* ---------------- ATTENDANCE ---------------- */
    const saveBtn = document.getElementById("save-data-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveAttendanceUI);
    }
    document.addEventListener("DOMContentLoaded", () => {
    loadMembers();   // 👈 THIS LINE
});


    /* ---------------- PROJECTS ---------------- */
    const addProjectBtn = document.getElementById("add-project-btn");
    if (addProjectBtn) {
        addProjectBtn.addEventListener("click", async () => {
            const project = {
                name: document.getElementById("project-name").value,
                type: document.getElementById("project-type").value,
                members: document.getElementById("project-members").value,
                link: document.getElementById("project-link").value,
                start: document.getElementById("project-start").value,
                end: document.getElementById("project-end").value
            };

            if (!project.name || !project.members || !project.start) {
                alert("Fill required project fields");
                return;
            }

            await addProject(project);
            alert("Project saved ✅");
        });
    }

    /* ---------------- CHAT ---------------- */
    const chatSendBtn = document.getElementById("chat-send-btn");
    const chatInput = document.getElementById("chat-input");

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener("click", async () => {
            const text = chatInput.value.trim();
            if (!text) return;
            await sendChatMessage(text);
            chatInput.value = "";
        });
    }

    /* ---------------- LOGOUT ---------------- */
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

});
document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 Clock
    if (typeof startClock === "function") {
        startClock();
    }

    // 🔹 Auth check
    if (typeof checkAuth === "function") {
        checkAuth();
    }

    // 🔹 Attendance
    if (typeof loadMembers === "function") {
        await loadMembers();
    }

    if (typeof loadAttendanceHistory === "function") {
        await loadAttendanceHistory();
    }

    // 🔹 Projects
    if (typeof loadProjects === "function") {
        await loadProjects();
    }

    // 🔹 Chat
    if (typeof loadChat === "function") {
        await loadChat();
    }

    console.log("✅ App fully initialized");
});
