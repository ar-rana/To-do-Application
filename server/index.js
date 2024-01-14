import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import Todo from './models/todos_Schema.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(port);

const mongodb = "mongodb://127.0.0.1:27017/Cluster0";
mongoose.connect(mongodb).then(()=>console.log("Database Connected")).catch(err=>console.log(err));

app.get("/", (req,res)=>{
    res.send("This is server");
})

app.get('/todos', async (req,res)=>{
    const todos = await Todo.find();

    res.json(todos);
})

app.post('/todos/new',(req,res)=>{
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        complete: false
    });
    console.log(req.body);

    todo.save();
    res.json(todo)
})

app.delete('/todos/delete/:id', async (req,res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);

})

app.get('/todos/complete/:id', async (req,res)=>{
    const todo = await Todo.findByIdAndUpdate(req.params.id)
    todo.complete = !todo.complete

    todo.save();
    res.json(todo);
})

