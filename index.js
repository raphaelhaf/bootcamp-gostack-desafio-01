const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

/**
 * Count all requests made to api 
 */
const requestLog = (req, res, next) => {
    console.count('Request number')
    return next();
};
app.use(requestLog);

/**
 * Check if exist a project with the informed id
 */
const checkIfProjectIdExists = (req, res, next)=>{

    const { id } = req.params;

    const project = projects.find(project => project.id === id);

    if(!project)
        return res.status(400).json({'message':`The project with id ${id} does not exists.`});

    return next();
};

/**
 * Request body: id, title
 * Creates a new project
 */
app.post('/projects', (req,res) =>{
    
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.status(201).json(project);
});

/**
 * Return all projects added
 */
app.get('/projects',(req,res)=>{

    return res.json(projects);

});

/**
 * Route params: id
 * Request body: title
 * Edit project's title
 */
app.put('/projects/:id', checkIfProjectIdExists, (req,res)=>{

    const { id } = req.params;

    const { title } = req.body;

    const project = projects.find(project => project.id === id);

    project.title = title;

    return res.json(project);

});

/**
 * Route params: id
 * Request body: title
 * Add a task for specific project's id
 */
app.post('/projects/:id/tasks', checkIfProjectIdExists, (req,res)=>{
    
    const { id } = req.params;

    const { title } = req.body;

    const project = projects.find(project => project.id === id);

    project.tasks.push(title);

    return res.json(project);
});

/**
 * Route params: id
 * Remove specific project with informed id
 */
app.delete('/projects/:id', checkIfProjectIdExists, (req,res)=>{

    const { id } = req.params;

    const projectId = projects.findIndex(project => project.id === id);

    projects.splice(projectId,1);

    return res.status(200).send();
});

app.listen(3000, ()=>{
    console.log('Application Started');
});