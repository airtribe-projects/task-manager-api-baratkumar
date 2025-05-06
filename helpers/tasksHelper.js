// tasksHelper.js
const fs = require('fs');

function readTasks() {
  try {
    const data = fs.readFileSync('task.json', 'utf-8');
    return JSON.parse(data).tasks;
  } catch (error) {
    console.error('Error reading tasks:', error);
    return []; // Return an empty array or handle as needed
  }
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync('task.json', JSON.stringify({ tasks }, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error);
  }
}

module.exports = { readTasks, writeTasks };
