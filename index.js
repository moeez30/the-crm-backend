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
import activityRoutes from './routes/activityRoutes.js';
import logActivity from './middleware/activityLogger.js';

const path = 'path';
const { urlencoded, json } = pkg;
// app.use(express.json())
dotenv.config();

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

const corsOrigins =   {
    origin: ['http://localhost:3000', 'https://www.weshippinsuite.com']
  };

app.use((req, res, next) => {
    const origin = corsOrigins.origin.includes(req.headers.origin) ? req.headers.origin : 'https://www.weshippinsuite.com';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

// Middleware

// Routes
//app.options('*', cors());

app.use('/api/auth', authRoutes);
app.use('/api/admin', activityRoutes);


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
    // console.log(JSON.stringify(postBody))
    const pyScript = spawn('python',['getData.py']);
    pyScript.stdin.write(JSON.stringify(postBody));
    pyScript.stdin.end();

    let data = '';
    pyScript.stdout.on('data', (chunk) => {
        data += chunk.toString();
        //console.log(chunk.toString());
    });

    //console.log(data)
    
    pyScript.on('close', (code) => {
        //console.log(data)
        res.status(200).json({ 'data': data, message: 'hellohere' });
    });

});

app.post('/CreateUser', (req , res) =>{

    logActivity(req,req.body.theUser,"CREATE_USER",`ID : ${req.body.id}`);

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

app.post('/editingPermission', (req , res) =>{

    console.log(req.body)
    logActivity(req,req.body.user,"EDIT_PERMISSIONS",(req.body.editing)?"Editing Enabled":"Editing Disabled");

    const postBody = req.body
    //console.log(__dirname);
    console.log(JSON.stringify(postBody))
    //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
    const pyScript = spawn('python',["editingPermissionUpdate.py"]);

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

  logActivity(req,req.body.theUser,"CREATE_OPPORTUNITY",`ID : ${req.body.id}`);

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

app.post('/CreateExpense', (req , res) =>{

    logActivity(req,req.body.theUser,"CREATE_EXPENSE",`ID : ${req.body.id}`);

    const postBody = req.body
    //console.log(__dirname);
    console.log(JSON.stringify(postBody))
    //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
    const pyScript = spawn('python',["createNewExpense.py"]);
  
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

app.post('/updateOpportunityData', (req , res) =>{

    logActivity(req,req.body.theUser,"UPDATE_OPPORTUNITY",`ID : ${req.body.theID} Action: ${req.body.action}`)

    const postBody = req.body
    //console.log(__dirname);
    console.log(JSON.stringify(postBody))
    //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
    const pyScript = spawn('python',["updateOpportunity.py"]);
  
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


  app.post('/updateUserData', (req , res) =>{

    logActivity(req,req.body.user,"UPDATE_USER",`ID : ${req.body.theID}`)

    const postBody = req.body
    //console.log(__dirname);
    console.log(JSON.stringify(postBody))
    //const scriptPath = path.join(path.__dirname, 'pyscripts', 'createNewUser.py');
    const pyScript = spawn('python',["updateUser.py"]);
  
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