const mysql = require('mysql');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify pool operations
const query = util.promisify(pool.query).bind(pool);

pool.getConnection((err, conn) => {
    if (err) console.log(err);
    console.log("Connected successfully");
});

module.exports = query;



/*
const mysql = require('mysql')
const val =require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("Connected successfully")
})

module.exports = pool.promise()
*/

// const redisurl = "redis://127.0.0.1:6379";
// const client = redis.createClient(redisurl);
// let redisClient;
// (async()=> {
//  redisClient = redis.createClient({
//     host: '',
//     port: 16492,
//     // legacyMode: true
// });
// await redisClient.connect();
// })(); 

// app.use(bodyParser.json());