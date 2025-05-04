const express = require('express');
const path = require('path');
const router = express.Router();
const { readTasks, writeTasks } = require('../helpers/tasksHelper');
const { taskSchema } = require('../schemas/joi/tasksSchema');

const TASKS_FILE = path.join(__dirname, '../task.json');

// Define a schema for updates (all fields optional)
const updateTaskSchema = taskSchema.fork(['title', 'description', 'completed'], field => field.optional());

// GET /tasks - Get all tasks with pagination (10 per page)
router.get('/', (req, res) => {
  const tasks = readTasks();
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  // Determine which field to sort by, based on query params
  let sortBy = null;
  if (req.query.priority !== undefined) sortBy = 'priority';
  else if (req.query.timestamp !== undefined) sortBy = 'timestamp';
  else if (req.query.completed !== undefined) sortBy = 'completed';

  // Default to descending order unless 'asc' is specified
  const order = req.query.order === 'asc' ? 1 : -1;

  // Priority order for sorting
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  let sortedTasks = [];
  if (sortBy) {
    sortedTasks = [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * order;
        case 'completed':
          return ((a.completed === b.completed) ? 0 : a.completed ? 1 : -1) * order;
        case 'timestamp':
          return (new Date(a.timestamp) - new Date(b.timestamp)) * order;
        default:
          return 0;
      }
    });
  } else {
    sortedTasks = [...tasks].sort((a, b) => {
      return (priorityOrder[a.id] - priorityOrder[b.id]) * order;
    });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalTasks: tasks.length,
    totalPages: Math.ceil(tasks.length / pageSize),
    tasks: paginatedTasks
  });
});

// GET /tasks/:id - Get a single task by ID
router.get('/:id', (req, res) => {
    const tasks = readTasks();
    const { id } = req.params;
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  });

// ... existing code ...

// POST /tasks - Create a new task
router.post('/', (req, res) => {
  // Validate the request body
  const { error, value } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const tasks = readTasks();
  const { title, description, completed, priority } = value;
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    completed: completed || false,
    priority,
    timestamp: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
router.put('/:id', (req, res) => {
  // Validate the request body
  const { error, value } = updateTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const tasks = readTasks();
  const { id } = req.params;
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (value.title !== undefined) task.title = value.title;
  if (value.description !== undefined) task.description = value.description;
  if (value.completed !== undefined) task.completed = value.completed;
  if (value.priority !== undefined) task.priority = value.priority;
  task.updatedOn = new Date().toISOString();
  writeTasks(tasks);
  res.json(task);
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
  let tasks = readTasks();
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  const deletedTask = tasks.splice(index, 1)[0];
  writeTasks(tasks);
  res.json(deletedTask);
});

module.exports = router;