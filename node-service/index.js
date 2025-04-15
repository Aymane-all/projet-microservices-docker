const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.get('/hello', (req, res) => {
    res.send('Hello hi');
})

app.listen(5000,()=>{
    console.log('Rest api server listening on port 5000');
})