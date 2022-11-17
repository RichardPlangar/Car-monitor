const mysql = require('mysql');

const config = {
  host: '127.0.0.1:3306',
  user: 'root',
  password: 'password',
  database: 'hasznaltauto',
};

const db = mysql.createConnection(config);

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('The database connection is up');
  }
});

module.exports = {
  db: mysql.createConnection(config),
};
