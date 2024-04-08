

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const redis = require('redis');
// const util=require("util");
const db=require("../database/index")
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




/*
app.get('/data', (req, res) => {
  try {
    const { username } = req.params;
      redisClient.get(username, (error, data) => {
      if (error) {
        console.error('Error retrieving data from Redis:', error);
        res.status(500).json({ error: 'Error retrieving data from Redis' });
      } else {
        if (data) {
          const parsedData = JSON.parse(data);
          res.json(parsedData);
        } else {
          res.status(404).json({ error: 'Data not found for the provided username' });
        }
      }
    });
  } catch (error) {
    console.error('Error handling GET request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
*/




// client.set = util.promisify(client.set);

/*
app.post('/submit', async (req, res) => {
  const { username, language, input, source_code } = req.body;
  // const {key,value}=req.body;
  // const response = await client.set(key,value);
  // res.json(response);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp
  const query = "INSERT INTO `sample`(`username`, `language`, `input`, `source_code`, `timestamp`) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [username, language, input, source_code, timestamp], (err, data) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error inserting data' });
    }
    // Optionally, you can clear the cache here if necessary
    return res.json({ message: "Data inserted successfully" });
  });
});
*/

// mysql only..
/*
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const redis = require('redis');
const client = redis.createClient();


const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '', // Put your MySQL password here
  database: 'sample_db'
});
const client = redis.createClient({
  host: '<hostname>',
  port: <port>,
  password: '<password>'
});

client.on('error', err => {
  console.log('Error ' + err);
});


client.connect((err) => {
  if (err) {
    console.error('Error connecting to Redis:', err);
    // Handle connection error appropriately
  } else {
    console.log('Connected to Redis server');
  }
});

// app.post('/submit', (req, res) => {
//     const { username, language, input, source_code } = req.body;
//     const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp
//     const query = "INSERT INTO `sample`(`username`, `language`, `input`, `source_code`, `timestamp`) VALUES (?, ?, ?, ?, ?)";
//     db.query(query, [username, language, input, source_code, timestamp], (err, data) => {
//       if (err) return res.json(err);
//       return res.json({ message: "Data inserted successfully" });
//     });
//   });
app.post('/submit', (req, res) => {
  // Handle form submission as before

  // Clear cache
  client.del('entries', (err, response) => {
    if (err) throw err;
    console.log('Cache cleared:', response);
  });

  return res.json({ message: "Data inserted successfully" });
});

  
  // app.get('/entries', (req, res) => {
  //   const query = "SELECT * FROM `sample`"; // Query to fetch all entries
  //   db.query(query, (err, data) => {
  //     if (err) return res.json(err);
  //     return res.json(data);
  //   });
  // });
  app.get('/entries', (req, res) => {
    // Check if data is available in Redis cache
    client.get('entries', (err, data) => {
      if (err) throw err;
  
      if (data) {
        // Data found in cache, return it
        return res.json(JSON.parse(data));
      } else {
        // Data not found in cache, fetch from database
        const query = "SELECT * FROM `sample`";
        db.query(query, (err, data) => {
          if (err) return res.json(err);
  
          // Cache data in Redis
          client.setex('entries', 3600, JSON.stringify(data)); // Cache for 1 hour (3600 seconds)
  
          // Return data
          return res.json(data);
        });
      }
    });
  });
  
  
app.get('/', (req, res) => {
  return res.json('From backend side');
});

app.listen(8081, () => {
  console.log('Listening on port 8081');
});
*/




/*
app.post('/submit', (req, res) => {
  try {
    const { username, language, input, source_code } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp
    const data = {
      username,
      language,
      input,
      source_code,
      timestamp
    };
    console.log(username);
    const query = "INSERT INTO `sample`(`username`, `language`, `input`, `source_code`, `timestamp`) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [username, language, input, source_code, timestamp], (err, data) => {
      if (err) return res.json(err);
    });
    console.log(data);
    redisClient.set(username, JSON.stringify(data), (error, result) => {
      if (error) {
        console.error('Error inserting data into Redis:', error);
        res.status(500).json({ error: 'Error inserting data into Redis' });
      } else {
        console.log('Data inserted into Redis:', result);
        res.json({ message: "Data inserted successfully" });
      }
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/