const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express());

app.get('/', (req, res) => {
    res.send('Hello From Backend Of Assignment 10')
})


app.listen(port, () => {
    console.log(`assignment 10 is running on port ${port} `);
})
