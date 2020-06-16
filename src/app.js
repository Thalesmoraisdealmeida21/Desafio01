const express = require("express");
const cors = require("cors");
const {uuid} = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());




const repositories = [];

function repositoryExists(req, res, next){

  const { id } = req.params

  const repoIndex =  repositories.findIndex(repo => repo.id === id);


  console.log(repoIndex);
  if(repoIndex < 0){
    res.status(400).json({err: "Repo não existe"})
    return;
  }
    return next()
  

}



app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const  {title, url, techs} = request.body
  let repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id",  repositoryExists, (request, response) => {
      const { id } = request.params;
      const { title, url, techs} = request.body



      const repoIndex = repositories.findIndex(repo => repo.id === id);



      let repository = {
        title,
        url,
        techs,
        uuid: id,
        like: repositories[repoIndex].likes
      }

      repositories[repoIndex] = repository;
      console.log(repoIndex)
      response.json(repository)

});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
    const { id } = request.params;

    const repoIndex = repositories.findIndex(repo => repo.id === id);

    repositories.splice(repoIndex, 1);

    return response.status(204).end();

});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  repositories[repoIndex].likes = repositories[repoIndex].likes + 1
  response.json(repositories[repoIndex]);

});

module.exports = app;
