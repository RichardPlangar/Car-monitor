const { app } = require('./routes');
const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('Something went wrong');
  } else {
    console.log('The server is up and running');
  }
});
