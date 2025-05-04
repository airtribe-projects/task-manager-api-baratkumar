// tasksHelper.js
const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join('task.json');

function readTasks() {
  const data = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(data).tasks;
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks }, null, 2));
}

module.exports = { readTasks, writeTasks };