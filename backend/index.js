/*

const express = require("express")
const redis= require("redis")
const util = require("util")

// import { createClient } from 'redis';

// const client = redis.createClient({
//     password: 'G2pve0Tc9WXdFaOboDHchSQ5iNOgvxnJ',
//     socket: {
//         host: 'redis-16492.c12.us-east-1-4.ec2.cloud.redislabs.com',
//         port: 16492
//     }
// });

const redisurl = "redis-16492.c12.us-east-1-4.ec2.cloud.redislabs.com:16492"

const client = redis.createClient(redisurl)
client.on("error",function(error){
    console.error("Error encounted:",error);
})
const app = express()
app.use(express.json())

app.post("/",async (req,res)=>{
    const{key,value}=req.body;
    const response = await client.set(key,value)
    res.json(response)
})
app.listen(8080, ()=>{
    console.log("hey, now listening to port 8080!!")
})

*/


/*
const express = require('express');
const redis = require('redis');
const util=require("util");

const app = express();
const bodyParser = require('body-parser');

// Initialize Redis client
const redisClient =  redis.createClient({
    host: 'redis-16492.c12.us-east-1-4.ec2.cloud.redislabs.com',
    port: 16492,
    password: 'G2pve0Tc9WXdFaOboDHchSQ5iNOgvxnJ'
});
// redisClient.on('connect', async function() {
//     console.log('Connected!');
//     });
const getAsync = util.promisify(redisClient.get).bind(redisClient);
const setAsync = util.promisify(redisClient.set).bind(redisClient);

app.use(bodyParser.json());
// Define a route
app.get('/data', async (req, res) => {
    // Example: Get data from Redis
    redisClient.get('some_key', (error, data) => {
        if (error) {
            console.error('Error retrieving data from Redis:', error);
            res.status(500).json({ error: 'Error retrieving data from Redis' });
        } else {
            res.json({ data });
        }
    });
});
// app.post('/',(req,res)=>{
//     console.log(req.body);
//     const{key,value}=req.body;
//     const response = redisClient.set(key,value)
//     res.json(response)
// })
app.post('/', async (req, res) => {
    console.log(req.body);
    const { key, value } = req.body;
    redisClient.set(key, value, (error, response) => {
        if (error) {
            console.error('Error storing data in Redis:', error);
            res.status(500).json({ error: 'Error storing data in Redis' });
        } else {
            console.log('Data stored successfully in Redis:', response);
            res.json({ message: 'Data stored successfully' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

*/


const express = require('express');
const redis = require('redis');
// const util = require('util');

const app = express();
const bodyParser = require('body-parser');

// Initialize Redis client
let redisClient;
(async()=> {
 redisClient = redis.createClient({
    host: 'redis-16492.c12.us-east-1-4.ec2.cloud.redislabs.com',
    port: 16492,
    // password: 'G2pve0Tc9WXdFaOboDHchSQ5iNOgvxnJ',
    // legacyMode: true
});
await redisClient.connect();
})(); 

// Promisifying Redis client methods
// const getAsync = util.promisify(redisClient.get).bind(redisClient);
// const setAsync = util.promisify(redisClient.set).bind(redisClient);

app.use(bodyParser.json());

// Define a route to handle GET requests
app.get('/data', async (req, res) => {
    try {
        // const data = await getAsync('some_key');
        res.json({ data });
    } catch (error) {
        console.error('Error retrieving data from Redis:', error);
        res.status(500).json({ error: 'Error retrieving data from Redis' });
    }
});

// Define a route to handle POST requests
app.post('/', async (req, res) => {
    try {
        const { key, value } = req.body;
        // await setAsync(key, value);
        // const response = redisClient.set(key,value)
        console.log('Data stored successfully in Redis');
        res.json({message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error storing data in Redis:', error);
        res.status(500).json({ error: 'Error storing data in Redis',details:error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

