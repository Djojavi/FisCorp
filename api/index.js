const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de datos simulada
let tasks = [
  {
    id: 1,
    title: "Finish Cypress Lab",
    description: "Create API tests",
    completed: false
  },
  {
    id: 2,
    title: "Study Express",
    description: "Review CRUD operations",
    completed: true
  }
];

// GET - Obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET - Obtener una tarea por ID
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  res.status(200).json(task);
});

// POST - Crear tarea
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required."
    });
  }

  if (title.length > 50) {
    return res.status(400).json({
      message: "Title cannot exceed 50 characters."
    });
  }

  const newTask = {
    id: tasks.length > 0
      ? Math.max(...tasks.map(t => t.id)) + 1
      : 1,
    title,
    description: description || "",
    completed: completed ?? false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PUT - Actualizar tarea
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  const { title, description, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required."
    });
  }

  if (title.length > 50) {
    return res.status(400).json({
      message: "Title cannot exceed 50 characters."
    });
  }

  task.title = title;
  task.description = description || "";
  task.completed = completed ?? false;

  res.status(200).json(task);
});

// DELETE - Eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted successfully."
  });
});

app.get('/', (req, res) => {
  res.send('Task API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});