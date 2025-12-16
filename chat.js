async function sendChatMessage(text) {
    await api("/chat", {
        method: "POST",
        body: JSON.stringify({
            sender: currentUser.name,
            message: text
        })
    });
}

async function loadChat() {
    return await api("/chat");
}
