const { db } = require('./database');

function createTableForEachAdvertisement() {
  const createBasicsTableQuery =
    'CREATE TABLE links ( id INT AUTO_INCREMENT PRIMARY KEY, advertise_id VARCHAR(255), link VARCHAR(600), car_name VARCHAR(255))';
  db.query(createBasicsTableQuery, (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
  });
}

function createTableForConditionOfEachCar() {
  const createConditionTableQuery =
    'CREATE TABLE car_condition ( id INT PRIMARY KEY AUTO_INCREMENT, release_year VARCHAR(20), car_condition VARCHAR(20), type VARCHAR(50), km VARCHAR(255), normal_price VARCHAR(255), additional_price VARCHAR(255) )';
  db.query(createConditionTableQuery, (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
  });
}

function insertIntoBasicsTable(links) {
  const insertMysqlQuery =
    'INSERT INTO links SET advertise_id = ?, link = ?, car_name = ?';
  links.forEach((x) => {
    db.query(
      insertMysqlQuery,
      [x.advertise_id, x.link, x.car_name],
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
  });
}

function insertIntoCarConditionTable(conditions) {
  const insertMysqlQuery =
    'INSERT INTO car_condition SET release_year = ?, car_condition = ?, type = ?, km = ?, normal_price = ?, additional_price = ?';
  conditions.forEach((condition) => {
    db.query(
      insertMysqlQuery,
      [
        condition.condition.releaseYear,
        condition.condition.carCondition,
        condition.condition.type,
        condition.condition.km,
        condition.condition.normalPrice,
        condition.condition.priceWithExtras,
      ],
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
  });
}

async function getLinksFromDatabase(numberOfCars) {
  return new Promise((resolve, reject) => {
    const sqlQuery = 'SELECT * FROM links WHERE id <= ?';
    db.query(sqlQuery, [numberOfCars], (err, rows) => {
      if (err) {
        reject(new Error(err));
      }
      resolve(JSON.parse(JSON.stringify(rows)));
    });
  });
}

module.exports = {
  insertIntoBasicsTable,
  insertIntoCarConditionTable,
  getLinksFromDatabase,
};
