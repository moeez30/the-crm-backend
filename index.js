import express from 'express';
import { spawn } from 'child_process';
import pkg from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
// const cors = require('fs');
import { readFileSync, writeFileSync } from 'fs';
import { schedule } from 'node-cron';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';

const path = 'path';
const { urlencoded, json } = pkg;
// app.use(express.json())
dotenv.config();

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Middleware

//app.use('*',cors());
const corsOrigins =   {
    origin: ['http://localhost:3000', "https://www.weshippinsuite.com"]
  };
  
   app.all('*', function(req, res, next) {
    const origin = corsOrigins.origin.includes(req.headers.origin) ? req.headers.origin : 'https://www.weshippinsuite.com';
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT", "OPTIONS");
    next();
  })
// Routes
app.use(express.json());
//app.options('*', cors());

app.use('/api/auth', authRoutes);




app.get('/status',(req,res) => {
    res.status(200).json({message: "Server is running"})
})


function getData() {
    return new Promise((res,rej) => {    
  
        const pyScript = spawn('python',['getData.py']);
  
        let data = 'portcap';
          // console.log(pyScript)
        pyScript.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });
  
        pyScript.on('close', (code) => {
            res(console.log(data, "onClose"))
        });
  
    })
  
  }

app.post('/getData', (req , res) =>{
    
    const postBody = req.body
    console.log(JSON.stringify(postBody))
    const pyScript = spawn('python',['getData.py']);
    pyScript.stdin.write(JSON.stringify(postBody));
    pyScript.stdin.end();

    let data = '';
    pyScript.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });
    
    pyScript.on('close', (code) => {
        console.log(data)
        res.status(200).json({ 'data': data, message: 'hellohere' });
    });

});

app.post('/CreateUser', (req , res) =>{

    const postBody = req.body
    //console.log(__dirname);
    console.log(JSON.stringify(postBody))
    //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
    const pyScript = spawn('python',["createNewUser.py"]);

    pyScript.stdin.write(JSON.stringify(postBody));
    pyScript.stdin.end();

    let data = '';

    pyScript.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    console.log(data)

    pyScript.on('close', (code) => {
        res.status(200).json({ 'data': data, message: 'hellohere' });
    });
})


app.post('/CreateOpportunity', (req , res) =>{

  const postBody = req.body
  //console.log(__dirname);
  console.log(JSON.stringify(postBody))
  //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
  const pyScript = spawn('python',["createNewOpp.py"]);

  pyScript.stdin.write(JSON.stringify(postBody));
  pyScript.stdin.end();

  let data = '';

  pyScript.stdout.on('data', (chunk) => {
      data += chunk.toString();
  });

  console.log(data)

  pyScript.on('close', (code) => {
      res.status(200).json({ 'data': data, message: 'hellohere' });
  });
})


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});