let currentUser = null;

async function loginUser(id, password) {
    currentUser = await api("/login", {
        method: "POST",
        body: JSON.stringify({ id, password })
    });
    return currentUser;
}

async function registerUser(data) {
    await api("/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

function logoutUser() {
    currentUser = null;
    document.getElementById("app-content").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
}
async function handleRegister() {
    const name = document.getElementById("reg-name").value.trim();
    const year = document.getElementById("reg-year").value;
    const batch = document.getElementById("reg-batch").value.trim();
    const id = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !batch || !id || !password) {
        alert("Fill all registration fields");
        return;
    }

    await registerUser({
        id,
        password,
        name,
        year,
        batch
    });

    alert("Account created ✅ Now login");
}
