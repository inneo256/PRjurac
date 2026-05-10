const API_URL = 'http://localhost:3005/tasks';

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const table = document.getElementById('tasks-table');
    table.innerHTML = `<tr>
        <th>ID</th><th>Title</th><th>Description</th><th>Status</th><th>Actions</th>
    </tr>`;
    tasks.forEach(task => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${task.id}</td>
            <td><input value="${task.title}" onchange="updateTask(${task.id}, this.value, '${task.description}', '${task.status}')"></td>
            <td><input value="${task.description}" onchange="updateTask(${task.id}, '${task.title}', this.value, '${task.status}')"></td>
            <td>
                <select onchange="updateTask(${task.id}, '${task.title}', '${task.description}', this.value)">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>pending</option>
                    <option value="done" ${task.status === 'done' ? 'selected' : ''}>done</option>
                </select>
            </td>
            <td><button onclick="deleteTask(${task.id})">Delete</button></td>
        `;
    });
}

async function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });
    fetchTasks();
}

async function updateTask(id, title, description, status) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status })
    });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

fetchTasks();

async function loadEmails() {
    try {
        const res = await fetch('http://localhost:3005/emails');
        const emails = await res.json();

        console.log(emails);

        const output = document.getElementById('emails-output');

        output.textContent = JSON.stringify(emails, null, 2);

    } catch (err) {
        alert("Ошибка: " + err.message);
    }
}