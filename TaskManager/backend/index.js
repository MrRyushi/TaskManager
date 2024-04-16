const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Setup database and tables
async function setupDatabase() {
    try {
        const databaseName = 'taskManager'; 
    await promisePool.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    await promisePool.query(`USE ${databaseName}`);

    const sqlCreateTable = `
        CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(40) NOT NULL
        )`;
    await promisePool.query(sqlCreateTable);
        console.log("Database and table are set up.");
    } catch (error) {
        console.error('Failed to setup database and table:', error);
    }
}

// Route Handlers
app.use(express.json());

app.get('/gettasks', async (req, res) => {
    try {
        const [tasks] = await promisePool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Failed to retrieve tasks:', error);
        res.status(500).send('Failed to retrieve tasks');
    }
});


app.post('/addtask', async (req, res) => {
    const { title, status } = req.body; 
    try {
        const [result] = await promisePool.query('INSERT INTO tasks (title, status) VALUES (?, ?)', [title, status]);
        res.status(201).send({ id: result.insertId, title, status });
    } catch (error) {
        res.status(500).send('Failed to add task');
    }
});

app.put('/updatetask/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const [result] = await promisePool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        res.send({ success: true, message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).send('Failed to update task');
    }
});

app.delete('/deletetask/:id', async (req, res) => {
    const taskId = req.params.id;  

    try {
        const [result] = await promisePool.query('DELETE FROM tasks WHERE id = ?', [taskId]);

        if (result.affectedRows === 0) {
            res.status(404).send({ success: false, message: "Task not found or already deleted" });
        } else {
            res.send({ success: true, message: 'Task deleted successfully' });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to delete task' });
    }
})

// Start server after ensuring database setup
setupDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    }).catch(error => {
        console.error('Failed to setup database:', error);
        process.exit(1);
});
