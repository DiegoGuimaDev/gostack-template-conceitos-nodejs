const express = require("express");
const cors = require("cors");
const HTTPStatus = require('http-status');

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(HTTPStatus.OK).json(repositories);
});

app.post("/repositories", (request, response) => {
  try {
    const {title, url, techs} = request.body;
    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    };
    repositories.push(repository);
    return response.status(HTTPStatus.CREATED).json(repository);
  } catch (err) {
    response.status(HTTPStatus.BAD_REQUEST).send('Invalid params');
  }
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  if(repositoryIndex === -1) return response.status(HTTPStatus.BAD_REQUEST).send('repository not found');
  const repository = repositories[repositoryIndex];

  const {title, url, techs} = request.body;
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.status(HTTPStatus.OK).json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  if(repositoryIndex === -1) return response.status(HTTPStatus.BAD_REQUEST).send('repository not found');

  const repository = repositories[repositoryIndex];

  repositories.splice(repositoryIndex,1);

  return response.status(HTTPStatus.NO_CONTENT).json(repository);

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  if(repositoryIndex === -1) return response.status(HTTPStatus.BAD_REQUEST).send('repository not found');

  repositories[repositoryIndex].likes += 1;

  return response.status(HTTPStatus.CREATED).json(repositories[repositoryIndex]);


});

module.exports = app;
