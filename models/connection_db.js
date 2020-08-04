// DataBase
const config = require('../config/development_config');
const mysqlt = require("mysql");

const connection = mysqlt.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database // remember to switch database
});

connection.connect(err => {
  if (err) {
    console.log('Database connecting error');
  } else {
    console.log('Database connecting success');
  }
});

module.exports = connection;