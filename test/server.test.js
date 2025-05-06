const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
    priority: "medium"
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.hasOwnProp(response.body, "priority");
  t.hasOwnProp(response.body, "timestamp");
  t.equal(response.body.priority, "medium");
  t.type(response.body.timestamp, "string");
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task"
    // missing priority
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.type(response.body.tasks, "array");
  t.hasOwnProp(response.body.tasks[0], "id");
  t.hasOwnProp(response.body.tasks[0], "title");
  t.hasOwnProp(response.body.tasks[0], "description");
  t.hasOwnProp(response.body.tasks[0], "completed");
  t.hasOwnProp(response.body.tasks[0], "priority");
  t.hasOwnProp(response.body.tasks[0], "timestamp");
  t.type(response.body.tasks[0].id, "number");
  t.type(response.body.tasks[0].title, "string");
  t.type(response.body.tasks[0].description, "string");
  t.type(response.body.tasks[0].completed, "boolean");
  t.type(response.body.tasks[0].priority, "string");
  t.type(response.body.tasks[0].timestamp, "string");
  t.end();
});

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "id");
  t.hasOwnProp(response.body, "title");
  t.hasOwnProp(response.body, "description");
  t.hasOwnProp(response.body, "completed");
  t.hasOwnProp(response.body, "priority");
  t.hasOwnProp(response.body, "timestamp");
  t.type(response.body.id, "number");
  t.type(response.body.title, "string");
  t.type(response.body.description, "string");
  t.type(response.body.completed, "boolean");
  t.type(response.body.priority, "string");
  t.type(response.body.timestamp, "string");
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "high"
  };
  const response = await server.put("/tasks/10").send(updatedTask);
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "updatedOn");
  t.type(response.body.updatedOn, "string");
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "high"
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true", // should be boolean
    priority: "high"
  };
  const response = await server.put("/tasks/11").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  console.log(response.status, response.body);
  t.equal(response.status, 404);
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
