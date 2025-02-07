const express = require('express');
const morgan = require('morgan');

const app = express();

const cors = require('cors');
require('dotenv').config();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());



const Person = require("./models/person");
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons =[
    // { 
    //   "id": "1",
    //   "name": "Arto Hellas", 
    //   "number": "040-123456"
    // },
    // { 
    //   "id": "2",
    //   "name": "Ada Lovelace", 
    //   "number": "39-44-5323523"
    // },
    // { 
    //   "id": "3",
    //   "name": "Dan Abramov", 
    //   "number": "12-43-234345"
    // },
    // { 
    //   "id": "4",
    //   "name": "Mary Poppendieck", 
    //   "number": "39-23-6423122"
    // }
]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get('/info', (req, res) => {
    const date = new Date();
    Person.find({}).then(persons=>{
        res.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${date}</p>`);
    })
})


app.get('/api/persons', (req, res) => {

    Person.find({}).then(persons=>{
        res.json(persons)
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person =>{
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))

    // const person = persons.find(person => person.id === id);
    // if(person){
    //     res.json(person);
    // } else {
    //     res.status(404).end();
    // }
})

app.post('/api/persons', (req, res, next) => {

    const body = req.body;
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }

    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    // const generateId = () => {
    //     return String(Math.floor(Math.random() * 10000000));
    // }
    const person = new Person( {
        name: body.name,
        number: body.number,    
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(error => {
        next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id= req.params.id;
    const { number } = req.body
    console.log(req.body.number)
    Person.findByIdAndUpdate(id, { number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
        if (updatedPerson) {
            res.json(updatedPerson)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then((result)=>
    res.status(204).end()).catch(error => next(error))
    // persons = persons.filter(person => person.id !== id);
    // res.status(204).end();
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'});
}
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if(error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'});
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    } 
    next(error);
}



app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


