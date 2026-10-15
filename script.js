// ---------- DATA ----------
const subjects = [
  { name: "Data Structures",     code: "CS201", teacher: "Dr. A. Kumar", internal: 25, external: 60, credits: 4 },
  { name: "Operating Systems",   code: "CS202", teacher: "Dr. S. Verma", internal: 22, external: 55, credits: 4 },
  { name: "Database Management", code: "CS203", teacher: "Dr. P. Singh", internal: 26, external: 58, credits: 4 },
  { name: "Computer Networks",   code: "CS204", teacher: "Dr. R. Mehta", internal: 20, external: 52, credits: 3 },
  { name: "Web Technologies",    code: "CS205", teacher: "Dr. K. Joshi", internal: 28, external: 65, credits: 3 }
];

let students = [];   // registered students are stored here

// ---------- HELPERS ----------
const getGrade = t => t >= 80 ? "A" : t >= 70 ? "B" : t >= 60 ? "C" : "D";
const gradeColor = g => ({ A: "success", B: "primary", C: "warning", D: "danger" })[g];

// ---------- SUBJECT TABLE ----------
function renderSubjects() {
  const q = document.getElementById("search").value.toLowerCase();
  const f = document.getElementById("gradeFilter").value;
  let html = "", n = 0;

  subjects.forEach((s, i) => {
    const total = s.internal + s.external;
    const g = getGrade(total);
    if (!s.name.toLowerCase().includes(q)) return;     // search
    if (f !== "All" && g !== f) return;                // filter
    n++;
    html += `
      <tr>
        <td>${n}</td>
        <td class="text-start">${s.name}</td>
        <td>${s.teacher}</td>
        <td>${s.internal}</td>
        <td>${s.external}</td>
        <td>${total}</td>
        <td><span class="badge bg-${gradeColor(g)}">${g}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="viewSubject(${i})">View</button></td>
      </tr>`;
  });

  document.getElementById("subjectBody").innerHTML =
    html || `<tr><td colspan="8" class="text-muted">No records found</td></tr>`;
}

// ---------- MODAL ----------
function viewSubject(i) {
  const s = subjects[i];
  const total = s.internal + s.external;
  const g = getGrade(total);
  document.getElementById("modalBody").innerHTML = `
    <table class="table table-sm mb-0">
      <tr><th>Subject</th><td>${s.name}</td></tr>
      <tr><th>Subject Code</th><td>${s.code}</td></tr>
      <tr><th>Teacher</th><td>${s.teacher}</td></tr>
      <tr><th>Internal Marks</th><td>${s.internal} / 30</td></tr>
      <tr><th>External Marks</th><td>${s.external} / 70</td></tr>
      <tr><th>Total Marks</th><td>${total} / 100</td></tr>
      <tr><th>Grade</th><td><span class="badge bg-${gradeColor(g)}">${g}</span></td></tr>
      <tr><th>Credits</th><td>${s.credits}</td></tr>
    </table>`;
  new bootstrap.Modal(document.getElementById("subjectModal")).show();
}

// ---------- OVERALL PERFORMANCE BAR ----------
function updatePerformance() {
  const sum = subjects.reduce((a, s) => a + s.internal + s.external, 0);
  const avg = Math.round(sum / subjects.length);
  document.getElementById("perfBar").style.width = avg + "%";
  document.getElementById("perfText").textContent = avg + "%";
}

// ---------- REGISTRATION ----------
document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!this.checkValidity()) {
    this.classList.add("was-validated");
    return;
  }
  const roll = document.getElementById("roll").value.trim();
  if (students.some(s => s.roll === roll)) {
    alert("This roll number is already registered!");
    return;
  }
  students.push({
    name:   document.getElementById("name").value.trim(),
    roll:   roll,
    email:  document.getElementById("email").value.trim(),
    branch: document.getElementById("branch").value
  });
  this.reset();
  this.classList.remove("was-validated");
  renderStudents();
});

function renderStudents() {
  let html = "";
  students.forEach((s, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.roll}</td>
        <td>${s.email}</td>
        <td>${s.branch}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteStudent(${i})">Delete</button></td>
      </tr>`;
  });
  document.getElementById("studentBody").innerHTML =
    html || `<tr><td colspan="6" class="text-muted">No students registered yet</td></tr>`;
  document.getElementById("count").textContent = students.length;
}

function deleteStudent(i) {
  if (confirm("Delete this student?")) {
    students.splice(i, 1);
    renderStudents();
  }
}

// ---------- EVENTS + FIRST LOAD ----------
document.getElementById("search").addEventListener("input", renderSubjects);
document.getElementById("gradeFilter").addEventListener("change", renderSubjects);

renderSubjects();
renderStudents();
updatePerformance();