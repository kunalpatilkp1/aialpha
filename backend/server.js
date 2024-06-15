const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = './tasks.json';

const readTasks = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
};

const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

app.get('/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id == req.params.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const filteredTasks = tasks.filter(task => task.id != req.params.id);
  writeTasks(filteredTasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
