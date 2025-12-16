// -------------------- STATE --------------------
let attendanceState = {};

// -------------------- UI RENDER --------------------
function renderStudentsUI(students) {
    const attendanceList = document.getElementById("attendance-list");
    attendanceList.innerHTML = "";
    attendanceState = {};

    students.forEach(s => {
        attendanceState[s] = "MARK";

        const li = document.createElement("li");
        li.className = "student-item unmarked";
        li.id = s.replace(/[^a-zA-Z0-9]/g, "_");

        li.innerHTML = `
            <div class="student-name">${s.split(": ")[1]}</div>
            <div class="status-controls">
                <button class="btn-present">Present</button>
                <button class="btn-absent">Absent</button>
                <button class="btn-reset">Reset</button>
            </div>
        `;

        const [presentBtn, absentBtn, resetBtn] = li.querySelectorAll("button");

        presentBtn.onclick = () => updateStatus(s, "PRESENT", li);
        absentBtn.onclick = () => updateStatus(s, "ABSENT", li);
        resetBtn.onclick  = () => updateStatus(s, "MARK", li);

        attendanceList.appendChild(li);
    });

    updateSummaryUI();
}

// -------------------- STATUS UPDATE --------------------
function updateStatus(key, status, li) {
    attendanceState[key] = status;

    li.classList.remove("present", "absent", "unmarked");
    if (status === "PRESENT") li.classList.add("present");
    else if (status === "ABSENT") li.classList.add("absent");
    else li.classList.add("unmarked");

    updateSummaryUI();
}

// -------------------- SUMMARY --------------------
function updateSummaryUI() {
    const totalPresent = document.getElementById("total-present");
    const totalAbsent = document.getElementById("total-absent");
    const presentPercentage = document.getElementById("present-percentage");
    const absentList = document.getElementById("absent-list");

    let p = 0, a = 0;
    let absentNames = [];

    Object.keys(attendanceState).forEach(k => {
        if (attendanceState[k] === "PRESENT") p++;
        if (attendanceState[k] === "ABSENT") {
            a++;
            absentNames.push(k.split(": ")[1]);
        }
    });

    const total = Object.keys(attendanceState).length;
    const percent = total ? ((p / total) * 100).toFixed(1) : 0;

    totalPresent.textContent = p;
    totalAbsent.textContent = a;
    presentPercentage.textContent = percent + "%";

    absentList.innerHTML = absentNames.length
        ? absentNames.map(n => `<li>${n}</li>`).join("")
        : "<li>No absentees</li>";
}

// -------------------- SAVE TO BACKEND --------------------
async function saveAttendanceUI() {
    const date = document.getElementById("attendance-date").value;
    const topic = document.getElementById("attendance-subject").value;
    const taker = document.getElementById("attendance-taker-select").value;

    if (!date || !taker) {
        alert("Select date and attendance taker");
        return;
    }

    const attendanceArray = Object.keys(attendanceState).map(k => {
        const [group, name] = k.split(": ");
        return { group, name, status: attendanceState[k] };
    });

    for (const a of attendanceArray) {
        await api("/attendance", {
            method: "POST",
            body: JSON.stringify({
                date,
                topic,
                taken_by: taker,
                member: `${a.group}: ${a.name}`,
                status: a.status
            })
        });
    }

    alert("Attendance saved successfully ✅");
}
async function loadMembers() {
    const users = await api("/users");
    const select = document.getElementById("attendance-taker-select");

    select.innerHTML = `<option value="">Select Member</option>`;

    users.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.name;
        opt.textContent = `${u.name} (${u.year})`;
        select.appendChild(opt);
    });
}
