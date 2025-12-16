const API_BASE = "http://localhost:5000";

async function api(path, options = {}) {
    const res = await fetch(API_BASE + path, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
}
