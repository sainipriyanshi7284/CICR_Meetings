// --- CONFIGURATION ---
const USERNAME = "CICRMEETIN";
const PASSWORD = "CICRMEET25";
const ALL_GROUPS = ["4th Year", "3rd Year", "2nd Year", "1st Year"];

const DEFAULT_STUDENTS = [
	"4th Year: Archit Jain",
	"3rd Year: Yasharth",
	"3rd Year: Dhruvi Gupta",
	"3rd Year: Aryan Varshney",
	"2nd Year: Aradhaya",
	"2nd Year: Gunjan",
	"2nd Year: Aman",
	"1st Year: Rohan Verma",
	"1st Year: Kumar Shaurya",
	"1st Year: Parth Sachdeva",
	"1st Year: Shreya",
	"1st Year: Neeshal",
	"1st Year: Priyanshi",
	"1st Year: Bhuwan",
	"1st Year: Raghav"
];
let h4_students = []; // Will be populated from localStorage

let attendanceState = {};

// --- DOM ELEMENTS ---
const splashScreen = document.getElementById("splash-screen");
const attendanceList = document.getElementById("attendance-list");
const subjectSelector = document.getElementById("attendance-subject");
const totalPresent = document.getElementById("total-present");
const totalAbsent = document.getElementById("total-absent");
const presentPercentage = document.getElementById("present-percentage");
const absentListElement = document.getElementById("absent-list");
const attendanceTakenBy = document.getElementById("attendance-taken-by");
const historyListElement = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const exportExcelBtn = document.getElementById("export-excel-btn");
const attendanceTakerSelect = document.getElementById("attendance-taker-select");
const customTopicInput = document.getElementById("custom-topic-input");
const yearSelect = document.getElementById("year-select"); // Now a MULTIPLE select
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const saveBtn = document.getElementById("save-data-btn");
const attendanceDate = document.getElementById("attendance-date");
const loginForm = document.getElementById("login-form");
const loginScreen = document.getElementById("login-screen");
const appContent = document.getElementById("app-content");
const loginError = document.getElementById("login-error");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const createGMeetBtn = document.getElementById("create-gmeet-btn");
const meetingSummaryInput = document.getElementById("meeting-summary");
const removeSelectedBtn = document.getElementById("remove-selected-btn"); 
const digitalClock = document.getElementById("digital-clock");
const personalReportBody = document.getElementById("personal-report-body");

// NEW MEMBER MANAGEMENT ELEMENTS
const newMemberNameInput = document.getElementById("new-member-name");
const newMemberGroupSelect = document.getElementById("new-member-group");
const customGroupInput = document.getElementById("custom-group-input");
const addMemberBtn = document.getElementById("add-member-btn");
const removeMemberSelect = document.getElementById("remove-member-select");
const removeMemberBtn = document.getElementById("remove-member-btn");

// NEW SCHEDULING ELEMENTS
const scheduleInitiatorSelect = document.getElementById("schedule-initiator-select");
const scheduleRecipientSelect = document.getElementById("schedule-recipient-select");
const senderEmailInput = document.getElementById("sender-email"); 
const recipientEmailInput = document.getElementById("recipient-email"); 
const scheduleSubjectInput = document.getElementById("schedule-subject");
const scheduleDateInput = document.getElementById("schedule-date");
const scheduleTimeInput = document.getElementById("schedule-time");
const scheduleLocationTypeSelect = document.getElementById("schedule-location-type");
const scheduleLocationDetailsInput = document.getElementById("schedule-location-details");
const scheduleMeetingBtn = document.getElementById("schedule-meeting-btn");

// TAB ELEMENTS
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');


// --- TAB MANAGEMENT LOGIC ---

function switchTab(targetTabId) {
    tabLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const activeLink = document.querySelector(`.tab-link[data-tab="${targetTabId}"]`);
    const activeContent = document.getElementById(`${targetTabId}-content`);

    if (activeLink && activeContent) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-selected', 'true');
        activeContent.classList.add('active');
        
        // Specific functions to run when a tab is opened (to refresh data/UI)
        if (targetTabId === 'history') {
            renderHistory();
        } else if (targetTabId === 'reports') {
            calculatePersonalReport(); // FIXED
        }
    }
}


// --- DATA PERSISTENCE & INITIAL LOAD ---

function loadStudents() {
	const storedStudents = localStorage.getItem("cicrMembers");
	if (storedStudents) {
		h4_students = JSON.parse(storedStudents);
	} else {
		// Save default list on first run
		h4_students = DEFAULT_STUDENTS;
		saveStudents();
	}
}

function saveStudents() {
	localStorage.setItem("cicrMembers", JSON.stringify(h4_students));
	// After saving, re-render related UI elements
	populateAttendanceTakerDropdown();
	populateRemoveMemberDropdown();
	populateSchedulingDropdowns(); 
}

// --- UTILITY & UI FUNCTIONS ---

/** Clock Function */
function updateClock() {
	const now = new Date();
	// Time format (HH:MM:SS AM/PM)
	const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
	const timeString = now.toLocaleTimeString('en-US', timeOptions);
	
	// Date format (DD MMMM YYYY)
	const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
	const dateString = now.toLocaleDateString('en-US', dateOptions);

	digitalClock.textContent = `${dateString} // ${timeString}`;
}

function populateAttendanceTakerDropdown() {
	attendanceTakerSelect.innerHTML = '<option value="" disabled selected>-- SELECT MEMBER --</option>';
	h4_students.forEach((student) => {
		const option = document.createElement("option");
		option.value = student;
		option.textContent = student.split(": ")[1]; 
		attendanceTakerSelect.appendChild(option);
	});
}

function populateRemoveMemberDropdown() {
	removeMemberSelect.innerHTML = '<option value="" disabled selected>-- SELECT USER TO REMOVE --</option>';
	h4_students.forEach((student) => {
		const option = document.createElement("option");
		option.value = student;
		option.textContent = student; 
		removeMemberSelect.appendChild(option);
	});
}

// Populate scheduling dropdowns
function populateSchedulingDropdowns() {
	scheduleInitiatorSelect.innerHTML = '<option value="" disabled selected>-- SELECT SENDER --</option>';
	scheduleRecipientSelect.innerHTML = '<option value="" disabled selected>-- SELECT RECIPIENT --</option>';

	h4_students.forEach((studentData) => {
		const name = studentData.split(": ")[1];
		
		const initiatorOption = document.createElement("option");
		initiatorOption.value = name;
		initiatorOption.textContent = name;
		scheduleInitiatorSelect.appendChild(initiatorOption);
		
		const recipientOption = document.createElement("option");
		recipientOption.value = name;
		recipientOption.textContent = name;
		scheduleRecipientSelect.appendChild(recipientOption);
	});
}

function getMeetingTopic() {
	return subjectSelector.value === "Other" && customTopicInput.value.trim() !== "" 
		? customTopicInput.value.trim() 
		: subjectSelector.options[subjectSelector.selectedIndex].textContent;
}

function updateSubjectDisplay() {
	document.getElementById("current-subject-display").textContent = getMeetingTopic();
}

function handleTopicChange() {
	if (subjectSelector.value === "Other") {
		customTopicInput.style.display = "block";
		customTopicInput.focus();
	} else {
		customTopicInput.style.display = "none";
		customTopicInput.value = "";
	}
	updateSubjectDisplay();
}

function handleGroupChange() {
	if (newMemberGroupSelect.value === "Custom") {
		customGroupInput.style.display = "block";
		customGroupInput.focus();
	} else {
		customGroupInput.style.display = "none";
		customGroupInput.value = "";
	}
}

// --- MEMBER MANAGEMENT LOGIC ---

function addMember() {
	const name = newMemberNameInput.value.trim();
	let group = newMemberGroupSelect.value;

	if (!name) {
		alert("ERROR: Enter new user name.");
		return;
	}

	if (group === "Custom") {
		group = customGroupInput.value.trim();
		if (!group) {
			alert("ERROR: Enter custom unit name.");
			return;
		}
	}

	const newMemberString = `${group}: ${name}`;

	// Check for duplicates
	if (h4_students.includes(newMemberString)) {
		alert("ERROR: User already exists in this unit.");
		return;
	}

	h4_students.push(newMemberString);
	h4_students.sort(); 
	saveStudents();

	alert(`SUCCESS: User ${name} added to ${group}.`);
	
	// Reset inputs
	newMemberNameInput.value = "";
	newMemberGroupSelect.value = "1st Year";
	customGroupInput.value = "";
	customGroupInput.style.display = "none";
	renderStudents(); 
	calculatePersonalReport(); 
}

function removeMember() {
	const memberToRemove = removeMemberSelect.value;

	if (!memberToRemove) {
		alert("ERROR: Select a user to remove.");
		return;
	}

	if (!confirm(`CONFIRM: Permanently remove user "${memberToRemove}"? This action is IRREVERSIBLE.`)) {
		return;
	}

	const index = h4_students.indexOf(memberToRemove);
	if (index > -1) {
		h4_students.splice(index, 1);
		saveStudents();
		alert(`SUCCESS: User removed.`);
	}

	renderStudents(); 
	calculatePersonalReport(); 
}


// --- ATTENDANCE CORE LOGIC (MODIFIED FOR MULTI-SELECT) ---

function getSelectedGroups() {
    // Get all selected options from the multiple select box
    const selectedOptions = Array.from(yearSelect.selectedOptions);
    return selectedOptions.map(option => option.value).filter(value => value);
}

function renderStudents() {
	attendanceList.innerHTML = "";
	attendanceState = {};
	
    const selectedGroups = getSelectedGroups();
    
    // Filter students: include if they belong to ANY selected group
	const filteredStudents = h4_students.filter(student => {
        const group = student.split(": ")[0];
        return selectedGroups.includes(group);
    });

	if (filteredStudents.length === 0) {
        if (selectedGroups.length === 0) {
            attendanceList.innerHTML = `<li style="padding: 15px; font-family: var(--font-data); opacity: 0.7;">// AWAITING INPUT: Please select at least one Group/Unit via filter.</li>`;
        } else {
            attendanceList.innerHTML = `<li style="padding: 15px; font-family: var(--font-data); color: var(--color-danger);">// SYSTEM ALERT: No users found matching selected units.</li>`;
        }
		updateSummary();
		return;
	}
    
    // Sort students by group name first, then by actual name
    filteredStudents.sort((a, b) => {
        const groupA = a.split(": ")[0];
        const groupB = b.split(": ")[0];
        if (groupA !== groupB) {
            // Sort by ALL_GROUPS order, placing unknown groups at the end
            const indexA = ALL_GROUPS.indexOf(groupA);
            const indexB = ALL_GROUPS.indexOf(groupB);
            
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
			return indexA - indexB;
		}
        return a.split(": ")[1].localeCompare(b.split(": ")[1]);
    });


	filteredStudents.forEach((studentData, index) => {
		const parts = studentData.split(": ");
		const role = parts[0];
		const name = parts[1];
		const studentKey = studentData;

		attendanceState[studentKey] = "MARK";

		const listItem = document.createElement("li");
		listItem.className = "student-item unmarked";
		listItem.id = studentKey.replace(/[^a-zA-Z0-9]/g, "_");
		listItem.innerHTML = `
			<div class="student-info">
				<div>
					<div class="student-name">${name}</div>
					<div class="student-id">[UNIT: ${role} // ID: ${index + 1}]</div>
				</div>
			</div>
			<div class="status-controls">
				<button class="status-button btn-present" data-key="${studentKey}" style="opacity: 0.4;">PRESENT</button>
				<button class="status-button btn-absent" data-key="${studentKey}" style="opacity: 0.4;">ABSENT</button>
				<button class="status-button btn-unmarked" data-key="${studentKey}" style="opacity: 1.0;">MARK</button>
			</div>
		`;
		attendanceList.appendChild(listItem);
	});

	// --- **COMPLETED STATUS BUTTON LOGIC** ---
	attendanceList.querySelectorAll(".status-button").forEach(button => {
		button.addEventListener("click", e => {
			const key = e.target.getAttribute("data-key");
			const status = e.target.textContent; 
			attendanceState[key] = status; 
			
			const listItem = document.getElementById(key.replace(/[^a-zA-Z0-9]/g, "_"));
			
			const controls = listItem.querySelector(".status-controls");
			controls.querySelectorAll(".status-button").forEach(btn => btn.style.opacity = '0.4');

			listItem.classList.remove("present", "absent", "unmarked");
			
			if (status === "PRESENT") {
				listItem.classList.add("present");
			} else if (status === "ABSENT") {
				listItem.classList.add("absent");
			} else { // MARK
				listItem.classList.add("unmarked");
			}
			
			e.target.style.opacity = '1.0';

			updateSummary();
		});
	});
	updateSummary(); 
}

function updateSummary() {
	let presentCount = 0;
	let absentCount = 0;
	const total = Object.keys(attendanceState).length;
	let absentNames = [];

	for (const key in attendanceState) {
		const status = attendanceState[key];
		if (status === "PRESENT") {
			presentCount++;
		} else if (status === "ABSENT") {
			absentCount++;
			absentNames.push(key.split(": ")[1]);
		}
	}

	const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0.0";
	
	totalPresent.textContent = presentCount;
	totalAbsent.textContent = absentCount;
	presentPercentage.textContent = `${percentage}%`;
	
	presentPercentage.classList.remove("poor");
	if (parseFloat(percentage) < 70) {
		presentPercentage.classList.add("poor");
	}

	absentListElement.innerHTML = absentNames.length > 0 
		? absentNames.map(name => `<li style="font-family: var(--font-data); color: var(--color-danger);">${name}</li>`).join("")
		: '<li style="font-family: var(--font-data); color: var(--color-success);">NO ABSENCES DETECTED.</li>';
}

function saveData() {
	const selectedGroups = getSelectedGroups();
    
    if (Object.keys(attendanceState).length === 0 || selectedGroups.length === 0) {
		alert("ERROR: Select at least one group and mark at least one user before committing data.");
		return;
	}

	if (!attendanceDate.value) {
		alert("ERROR: Select session date.");
		return;
	}

	if (attendanceTakerSelect.value === "") {
		alert("ERROR: Select attendance recording agent.");
		return;
	}

	const unmarkedCount = Object.values(attendanceState).filter(status => status === "MARK").length;
	if (unmarkedCount > 0) {
		if (!confirm(`WARNING: ${unmarkedCount} user(s) unmarked. Commit data anyway?`)) {
			return;
		}
	}

	const history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");

	const attendanceRecords = Object.keys(attendanceState).map(key => {
		const [group, name] = key.split(": ");
		return { name, group, status: attendanceState[key] };
	});

	// Use the array of selected groups for the record
	const newRecord = {
		id: Date.now(),
		date: attendanceDate.value,
		topic: getMeetingTopic(),
		// Store the combined groups as a comma-separated string for history/reports
		group: selectedGroups.join(', '), 
		taker: attendanceTakerSelect.options[attendanceTakerSelect.selectedIndex].textContent,
		summary: meetingSummaryInput.value.trim() || "NO SUMMARY PROVIDED.",
		attendance: attendanceRecords
	};

	history.unshift(newRecord);
	localStorage.setItem("attendanceHistory", JSON.stringify(history));
	
	alert(`DATA COMMITTED: ${getMeetingTopic()} on ${attendanceDate.value}. GROUPS: ${newRecord.group}`);

	// Reset UI
	// We cannot easily deselect all items in a multi-select box, so we clear attendanceState and call render to clear the list.
    Array.from(yearSelect.options).forEach(option => option.selected = false);
	attendanceState = {};
	meetingSummaryInput.value = "";
	// Retain date and taker for quick subsequent entry, if needed
	// attendanceDate.value = ""; 
	// attendanceTakerSelect.value = ""; 
	attendanceTakenBy.textContent = "ATTENDANCE TAKEN BY: [NONE SELECTED]";
	renderStudents(); 
	renderHistory();
	calculatePersonalReport();
}

// --- HISTORY & REPORTING LOGIC ---

function renderHistory() {
	const history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
	historyListElement.innerHTML = "";
	if (history.length === 0) {
		historyListElement.innerHTML = '<li style="padding: 15px; font-family: var(--font-data); opacity: 0.6;">// NO SYSTEM LOGS AVAILABLE.</li>';
		document.getElementById("remove-selected-btn").style.display = 'none';
		document.getElementById("clear-history-btn").style.display = 'none';
		return;
	}

	document.getElementById("remove-selected-btn").style.display = 'block';
	document.getElementById("clear-history-btn").style.display = 'block';

	history.forEach(record => {
		const listItem = document.createElement("li");
		listItem.className = "history-item";
		listItem.setAttribute('data-id', record.id);

		const presentCount = record.attendance.filter(a => a.status === "PRESENT").length;
		const totalCount = record.attendance.filter(a => a.status !== "MARK").length; 
		const absentees = record.attendance.filter(a => a.status === "ABSENT").map(a => a.name).join(", ") || "NONE DETECTED";
		const presentPercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(0) : 0;

		listItem.innerHTML = `
			<div class="history-header-wrapper">
				<input type="checkbox" class="history-checkbox" data-id="${record.id}">
				<button class="history-header-btn" onclick="toggleDetails(this.parentNode.parentNode)">
					<span>[${record.date}] // TOPIC: ${record.topic} (${record.group})</span>
					<span style="font-weight: 700; color: var(--color-accent-violet);">${presentCount}/${totalCount} (${presentPercentage}%)</span>
				</button>
			</div>
			<div class="history-details">
				<p><strong>ATTENDANCE AGENT:</strong> ${record.taker}</p>
				<p><strong>SUMMARY:</strong> ${record.summary}</p>
				<p><strong>ABSENT USERS:</strong> ${absentees}</p>
				<p style="margin-top:10px;"><strong>FULL RECORD:</strong></p>
				<ul class="full-record-list">
					${record.attendance.map(a => `<li style="color:${a.status === 'PRESENT' ? 'var(--color-success)' : 'var(--color-danger)'}">${a.name} [STATUS: ${a.status}]</li>`).join("")}
				</ul>
			</div>
		`;
		historyListElement.appendChild(listItem);
	});
}

function toggleDetails(element) {
	element.classList.toggle("active");
}

function clearHistory() {
	if (confirm("CRITICAL WARNING: Delete ALL system logs? This action is IRREVERSIBLE.")) {
		localStorage.removeItem("attendanceHistory");
		renderHistory();
		calculatePersonalReport();
		alert("SYSTEM LOGS CLEARED.");
	}
}

function removeSelectedRecords() {
	const checkboxes = document.querySelectorAll('.history-checkbox:checked');
	if (checkboxes.length === 0) {
		alert("ERROR: Select at least one record for deletion.");
		return;
	}

	if (!confirm(`CONFIRM: Remove ${checkboxes.length} selected log entry(s)?`)) {
		return;
	}

	let history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
	const idsToRemove = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));

	history = history.filter(record => !idsToRemove.includes(record.id));
	localStorage.setItem("attendanceHistory", JSON.stringify(history));
	
	renderHistory();
	calculatePersonalReport();
	alert(`SUCCESS: ${idsToRemove.length} log entry(s) removed.`);
}

function calculatePersonalReport() {
	// FIX: Logic to correctly aggregate attendance data across all records
	const history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
	
	// Initialize report data structure for all current students
	const reportData = {};

	h4_students.forEach(member => {
        // Use the full member string (Group: Name) as the key for reliable tracking
        const memberKey = member;
		reportData[memberKey] = { 
            totalMeetings: 0, 
            attended: 0, 
            group: member.split(": ")[0],
            name: member.split(": ")[1]
        };
	});

	// Aggregate data from history
	history.forEach(record => {
		record.attendance.forEach(att => {
			const key = `${att.group}: ${att.name}`;
			
            // Only count records if the user still exists in the master list, 
            // and the attendance was explicitly marked (not 'MARK')
			if (reportData[key] && att.status !== "MARK") {
				reportData[key].totalMeetings += 1; 
				if (att.status === "PRESENT") {
					reportData[key].attended += 1;
				}
			}
		});
	});

	personalReportBody.innerHTML = "";
    
    // Convert the object keys (member strings) into an array for sorting
	const sortedMemberKeys = Object.keys(reportData).sort((a, b) => {
		const groupA = reportData[a].group;
		const groupB = reportData[b].group;
		
		if (groupA !== groupB) {
            // Sort by ALL_GROUPS order
            const indexA = ALL_GROUPS.indexOf(groupA);
            const indexB = ALL_GROUPS.indexOf(groupB);
			
			// Place unknown/custom groups at the end
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
			return indexA - indexB;
		}
		// Secondary sort by name
		return reportData[a].name.localeCompare(reportData[b].name);
	});

	if (sortedMemberKeys.length === 0) {
		personalReportBody.innerHTML = '<tr><td colspan="3" style="font-family: var(--font-data); opacity: 0.6;">NO USER DATA OR LOGS FOUND.</td></tr>';
		return;
	}

    // Populate the report table body
	sortedMemberKeys.forEach(key => {
		const data = reportData[key];
		
		const percentage = data.totalMeetings > 0 
			? ((data.attended / data.totalMeetings) * 100).toFixed(1) 
			: "N/A";

		const percentageDisplay = data.totalMeetings > 0 
			? `${percentage}% (${data.attended}/${data.totalMeetings})` 
			: 'N/A';
			
		const isPoor = data.totalMeetings > 0 && parseFloat(percentage) < 70;
		const row = document.createElement("tr");

		row.innerHTML = `
			<td>${data.name}</td>
			<td>${data.group}</td>
			<td class="report-percentage ${isPoor ? 'poor' : ''}">${percentageDisplay}</td>
		`;
		personalReportBody.appendChild(row);
	});
}

// --- GMEET LINK GENERATION LOGIC ---

function createGMeetLink() {
	const dateValue = attendanceDate.value;
	const topic = getMeetingTopic();

	if (!dateValue) {
		alert("ERROR: Input session date.");
		return;
	}

	const datePart = dateValue.replace(/-/g, '');
	const startTime = '090000'; 
	const endTime = '100000'; 

	const encodedTopic = encodeURIComponent(topic);

	const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodedTopic}&dates=${datePart}T${startTime}/${datePart}T${endTime}&details=VIRTUAL%20INTERFACE%20INITIALIZATION%20FOR%20${encodedTopic}.%20Please%20create%20and%20share%20the%20Meet%20link%20from%20Google%20Calendar.`;

	window.open(calendarUrl, '_blank');
	
	alert("VIRTUAL INTERFACE COMMAND: Opening Google Calendar for link initialization.");
}

// --- EXCEL EXPORT LOGIC ---
function exportToCSV() {
	const history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
	if (history.length === 0) {
		alert("ERROR: No logs available for export.");
		return;
	}

	let csvContent = "data:text/csv;charset=utf-8,";
	
	const headers = ["Date", "Topic", "Group", "Taker", "Summary", "Member Name", "Member Group", "Status"];
	csvContent += headers.join(",") + "\n";

	history.forEach(record => {
		const escape = (text) => `"${String(text).replace(/"/g, '""')}"`;

		record.attendance.forEach(att => {
			const row = [
				escape(record.date),
				escape(record.topic),
				escape(record.group),
				escape(record.taker),
				escape(record.summary),
				escape(att.name),
				escape(att.group),
				escape(att.status)
			];
			csvContent += row.join(",") + "\n";
		});
	});

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", `CICR_Analytics_Export_${new Date().toISOString().slice(0, 10)}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	alert("SUCCESS: DATA STREAM EXPORT COMPLETE.");
}

// --- SCHEDULING LOGIC ---

function sendSchedulingRequest() {
	const initiator = scheduleInitiatorSelect.value;
	const recipient = scheduleRecipientSelect.value;
	const senderEmail = senderEmailInput.value.trim(); 
	const recipientEmail = recipientEmailInput.value.trim(); 
	const subject = scheduleSubjectInput.value.trim();
	const date = scheduleDateInput.value;
	const time = scheduleTimeInput.value;
	const locationType = scheduleLocationTypeSelect.value;
	const locationDetails = scheduleLocationDetailsInput.value.trim();

	if (!initiator || !recipient || !subject || !date || !time) {
		alert("ERROR: Required fields missing (Members, Subject, Date, Time).");
		return;
	}

	if (!senderEmail || !recipientEmail) {
		alert("ERROR: Required fields missing (Sender ID, Recipient ID).");
		return;
	}
	
	if (initiator === recipient) {
		alert("SYSTEM ALERT: Self-scheduling is prohibited.");
		return;
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(senderEmail)) {
		alert("ERROR: Invalid email format detected for Sender ID.");
		return;
	}

	const mailSubject = encodeURIComponent(`[SCHEDULING PROTOCOL] ${subject} - ${date} (${locationType})`);
	
	let mailBody = `TARGET: ${recipient}\n\n`;
	mailBody += `INITIATOR ${initiator} HAS REQUESTED A SCHEDULED INTERFACE. \n\n`;
	mailBody += `--- INTERFACE PARAMETERS ---\n`;
	mailBody += `TOPIC: ${subject}\n`;
	mailBody += `DATE: ${date}\n`;
	mailBody += `TIME: ${time}\n`;
	mailBody += `LOCATION: [TYPE: ${locationType} // DETAILS: ${locationDetails || 'TBD'}]\n\n`;
	mailBody += `ACTION REQUIRED: REPLY TO CONFIRM OR RE-NEGOTIATE PARAMETERS. \n(SENDER ID: ${senderEmail})`;

	const encodedMailBody = encodeURIComponent(mailBody);

	const mailtoLink = `mailto:${recipientEmail}?subject=${mailSubject}&body=${encodedMailBody}&cc=${senderEmail}`; 
	window.open(mailtoLink, '_self');

	alert(`SUCCESS: SCHEDULING PROTOCOL INITIATED for ${recipient}. Opening local mail client.`);
}


// --- EVENT LISTENERS & INITIALIZATION ---

function initializeListeners() {
	// Clock
	setInterval(updateClock, 1000);
	updateClock();
    
    // --- SPLASH SCREEN LOGIC ---
    // The splash screen is visible by default (CSS). This listener handles the transition to login.
    splashScreen.addEventListener('click', () => {
        // Fade out the splash screen
        splashScreen.style.opacity = '0';
        
        // After fade, hide it and show the login screen
        setTimeout(() => {
            splashScreen.style.display = 'none';
            loginScreen.style.display = 'block';
        }, 500); // 500ms matches CSS transition time
    });
    
    // Hide login screen initially, the splash screen click handles showing it
    loginScreen.style.display = 'none'; 

	// Login
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const enteredUsername = usernameInput.value.trim();
		const enteredPassword = passwordInput.value.trim();

		// NOTE: This uses hardcoded credentials as a placeholder for a real backend authentication process.
		if (enteredUsername === USERNAME && enteredPassword === PASSWORD) {
			loginScreen.style.display = 'none';
			appContent.style.display = 'block';
			loginError.style.display = 'none';
			
			loadStudents();
			populateAttendanceTakerDropdown();
			populateRemoveMemberDropdown();
			populateSchedulingDropdowns(); 
			renderHistory();
			calculatePersonalReport();
			renderStudents();
            
            switchTab('attendance'); 

		} else {
			loginError.textContent = `ACCESS DENIED. Invalid security key or authentication ID. (Hint: ID: ${USERNAME} / Key: ${PASSWORD})`;
			loginError.style.display = 'block';
			passwordInput.value = '';
		}
	});
    
    // --- Tab Navigation Listener ---
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

	// Theme Toggle
	themeToggleBtn.addEventListener('click', () => {
		document.body.classList.toggle('digital-mode');
		const isDigital = document.body.classList.contains('digital-mode');
		themeToggleBtn.setAttribute('aria-pressed', isDigital);
	});

	// Controls
	attendanceTakerSelect.addEventListener("change", () => {
		const selectedTaker = attendanceTakerSelect.value;
		const takerName = selectedTaker ? selectedTaker.split(": ")[1] : "[NONE SELECTED]";
		attendanceTakenBy.textContent = `ATTENDANCE TAKEN BY: ${takerName}`;
	});
    
    // MODIFIED LISTENER FOR MULTIPLE SELECTION
	yearSelect.addEventListener("change", renderStudents);
    
	customTopicInput.addEventListener("input", updateSubjectDisplay);
	subjectSelector.addEventListener("change", updateSubjectDisplay); 
	saveBtn.addEventListener("click", saveData);
	createGMeetBtn.addEventListener("click", createGMeetLink); 

	// History Controls
	clearHistoryBtn.addEventListener("click", clearHistory);
	exportExcelBtn.addEventListener("click", exportToCSV); 
	removeSelectedBtn.addEventListener("click", removeSelectedRecords);

	// Management Listeners
	newMemberGroupSelect.addEventListener("change", handleGroupChange);
	addMemberBtn.addEventListener("click", addMember);
	removeMemberBtn.addEventListener("click", removeMember);
	
	// Scheduling Listener
	scheduleMeetingBtn.addEventListener("click", sendSchedulingRequest);

	// --- FIX: Calendar Button and Date Initialization ---
    const today = new Date();
    // Format YYYY-MM-DD for date input value attribute
    const todayISO = today.toISOString().split('T')[0];
    
    // 1. Attendance Date Button/Initialization
    attendanceDate.value = todayISO;
    const openCalendarBtn = document.getElementById('open-calendar-btn');
    if (openCalendarBtn) {
        openCalendarBtn.addEventListener('click', () => {
            if (typeof attendanceDate.showPicker === 'function') {
                attendanceDate.showPicker();
            } else {
                attendanceDate.focus();
            }
        });
    }
    
    // 2. Scheduling Date Button/Initialization
    scheduleDateInput.value = todayISO;
    const openCalendarSchedulerBtn = document.getElementById('open-calendar-scheduler-btn');
    if (openCalendarSchedulerBtn) {
        openCalendarSchedulerBtn.addEventListener('click', () => {
            if (typeof scheduleDateInput.showPicker === 'function') {
                scheduleDateInput.showPicker();
            } else {
                scheduleDateInput.focus();
            }
        });
    }

	// Load students data immediately, regardless of login state (for dropdowns/logic initialization)
	loadStudents();
    
    // Check hash for initial tab if needed (will only apply after successful login)
    const initialTab = window.location.hash ? window.location.hash.substring(1) : 'attendance';
    if (document.getElementById(`${initialTab}-content`)) {
        // This only executes if app-content becomes visible later
        // switchTab(initialTab); // Best to let the successful login handler call this
    }
}

// Start the application
initializeListeners();