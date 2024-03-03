const express = require('express'), 
app = express(); 
  
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'mysecretpassword',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'animal_idle'
});


module.exports = {
  query: (text, params) => pool.query(text, params)
};


app.get('/',  
   (req, res) => {
      
const x = pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res.rows[0]);
  }
});
return res.send('Dockerizing Node Application 1' + x)
}) 
  
app.listen(5000,  
   () => console.log(`⚡️[bootup]: Server is running at port: 5000`));

