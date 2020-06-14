const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
const callPython = require('./callPython');
const spawn = require("child_process").spawn;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/example', (req, res) => res.render('pages/example'))
    .get('/callPython', (req, res) => {
        // spawn new child process to call the python script
        var process = spawn('python', ['./public/python/fetchURL.py', req.query.param]);
        // Takes stdout data from script which executed
        // with arguments and send this data to res object
        process.stdout.on('data', (data) => {
            var obj = {
                data: data.toString()
            }
            res.send(JSON.stringify(obj));
        });
    })
    .get('/db', async (req, res) => {
        try {
          const client = await pool.connect()
          const result = await client.query('SELECT * FROM test_table');
          const results = { 'results': (result) ? result.rows : null};
          res.render('pages/db', results );
          client.release();
        } catch (err) {
          console.error(err);
          res.send("Error " + err);
        }
      })
    .get('/cool', (req, res) => res.send(cool()))
    .get('/times', (req, res) => res.send(showTimes()))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}
