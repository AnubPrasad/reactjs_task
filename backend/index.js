

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const redis = require('redis');
// const util=require("util");
const db=require("./database/index")
const app = express();

const router = express.Router();
app.use(cors());
app.use(express.json());


app.post('/submit', async (req, res) => {
  try {
    const { username, language, input, source_code } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp
    const query = "INSERT INTO `sample`(`username`, `language`, `input`, `source_code`, `timestamp`) VALUES (?, ?, ?, ?, ?)";
    console.log(timestamp);
    // Execute MySQL query to insert data
    db.query(query, [username, language, input, source_code, timestamp], (mysqlError, mysqlResult) => {
      if (mysqlError) {
        console.error('Error inserting data into MySQL:', mysqlError);
        // return res.status(500).json({ error: 'Error inserting data into MySQL' });
      }
      
      console.log('Data inserted into MySQL:', mysqlResult);

      // Create data object to store in Redis
      const data = {
        username,
        language,
        input,
        source_code
      };

      // Store data in Redis
      // redisClient.set(username, JSON.stringify(data), (redisError, redisResult) => {
      //   if (redisError) {
      //     console.error('Error inserting data into Redis:', redisError);
      //     return res.status(500).json({ error: 'Error inserting data into Redis' });
      //   }
        
      //   console.log('Data inserted into Redis:', redisResult);
      //   return res.json({ message: "Data inserted successfully" });
      // });
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/entries', async (req, res) => {
  // check the data in redis
  // redisClient.get('entries', (err, data) => {
  //   if (err) {
  //     console.error('Error fetching data from cache:', err);
  //     return res.status(500).json({ error: 'Error fetching data from cache' });
  //   }
  //   if (data) {
  //     return res.json(JSON.parse(data));
  //   }
  //   });
    const query = "SELECT * FROM `sample`";
    db.query(query, (err, data) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        return res.status(500).json({ error: 'Error fetching data from database' });
      }

     
      // Return data
      return res.json(data);
  });
});

app.get('/', (req, res) => {
  return res.json('From backend side');
});

app.listen(8080, () => {
  console.log('Listening on port 8080')
});


