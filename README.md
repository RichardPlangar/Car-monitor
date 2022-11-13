# Car-monitor
## Description
The purpose of this project is to get all the car advertisement from a hungarian second hand car site. The program reads all the unique advertisement on the website,
store the links in a table in MySql database, then reads the links and store the car's conditions and features in another table.

## Dependencies
- NodeJS
- Axios
- Cheerio
- Express
- MySQL

## Install
Clone this repository:
```bash
https://github.com/RichardPlangar/Car-monitor
```
Install all the dependencies:
```bash
npm install
```
Config your own database connection.

## How to use
Call the functions in index.js file with a number. The first number as the first function argument will be referring to the number of pages you would like to get the advertisements from. Then will have all the links from the site in your local database management system. You can call the second function with a number. The number will be referring to the number of cars (links) in the database which the program will read.

Tip: Each page has around 30 advertisement.
