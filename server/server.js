const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({path : './config.env'})
const port = process.env.PORT ||5000;
app.use(cors());
app.use(express.json());
//mongo db connection
const con = require('./db/connection.js');

//using routes
app.use(require('./routes/route'));

con.then(db =>{
    if(!db) return process.exit(1);


app.listen(port,()=>
{
    console.log(`server is running  on port : http://localhost:${port}`)
})
    app.on('error',err => console.log(`Failed to connect with HTTP Server : ${err}`));
}).catch(error =>
{
    console.log(`Connection Failed...! ${eror}`);
}
);