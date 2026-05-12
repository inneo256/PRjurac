const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Подключение к БД
const db = mysql.createPool({
    host: process.env.DB_HOST || 'todo-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'todo_db'
});


app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});


app.get('/tasks/:id', (req, res) => {
    db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results[0]);
    });
});


app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], (err, results) => {
        if(err) return res.status(500).send(err);
         io.emit('tasksUpdated');
        res.json({ id: results.insertId, title, description, status: 'pending' });
    });
});


app.put('/tasks/:id', (req, res) => {
    const { title, description, status } = req.body;
    db.query(
        'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
        [title, description, status, req.params.id],
        (err) => {
            if(err) return res.status(500).send(err);
            io.emit('tasksUpdated');
            res.json({ message: 'Task updated' });
        }
    );
});


app.delete('/tasks/:id', (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
        if(err) return res.status(500).send(err);
         io.emit('tasksUpdated');
        res.json({ message: 'Task deleted' });
    });
});




const { sendEmail } = require('./email');
const { fetchEmails } = require('./emailService');


app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendEmail(to, subject, text);
        res.json({ message: 'Email sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await fetchEmails();
        res.json(emails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const POP3Client = require('poplib');

app.get('/pop3-check', (req, res) => {
    const client = new POP3Client(995, 'pop.mail.ru', {
        tlserrs: false,
        enabletls: true,
        debug: false
    });

    client.on('connect', () => {
        client.login(process.env.EMAIL, process.env.EMAIL_PASS);
    });

    client.on('login', (status) => {
        if (status) {
            client.stat();
        } else {
            res.status(500).json({ error: 'POP3 login failed' });
        }
    });

    client.on('stat', (status, data) => {
        if (status) {
            res.json({ protocol: 'POP3', messagesCount: data.count });
        } else {
            res.status(500).json({ error: 'POP3 stat failed' });
        }
        client.quit();
    });

    client.on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
});
server.listen(3001, () => console.log('Backend running on port 3001'));