const express = require('express');

const projects = [];
let numReq = 0;

function projectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);
  if (!project) {
    return res.status(400).send('Projeto não existe');
  }
  return next();
}

function log(req, res, next) {
  numReq += 1;
  console.log(
    numReq > 1
      ? `${numReq} requisições executadas até o momento`
      : `${numReq} requisição executada até o momento`
  );
  next();
}

const routes = express.Router();

routes.use(log);
routes.post('/projects', (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  res.json(projects);
});

routes.get('/projects', (req, res) => {
  res.json(projects);
});

routes.put('/project/:id', projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(element => element.id == id);
  project.title = title;
  return res.json(projects);
});

routes.delete('/project/:id', projectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);
  const index = projects.indexOf(project);
  projects.splice(index, 1);
  return res.json(projects);
});

routes.post('/projects/:id/tasks', projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(element => element.id == id);
  project.tasks.push(title);
  return res.json(projects);
});
module.exports = routes;
