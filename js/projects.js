async function addProject(project) {
    await api("/projects", {
        method: "POST",
        body: JSON.stringify(project)
    });
}

async function getProjects() {
    return await api("/projects");
}
