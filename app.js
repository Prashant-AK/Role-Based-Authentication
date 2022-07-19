const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('mongoose');
const passport = require('passport');
const { success, error } = require('consola');

// Bring in the App contants

const { DB, PORT } = require('./config');

// Initialize the application

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());

require('./middlewares/passport')(passport);
// routes
app.use('/api/users', require('./routes/users'));

const startApp = async () => {
  try {
    await connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    success({
      message: `Successfully connected with the Database \n ${DB}`,
      badge: true,
    });

    //Connection for server
    app.listen(PORT, () =>
      success({ message: `Server is running on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with the Database \n ${err}`,
      badge: true,
    });
    startApp();
  }
};

// Start the App
startApp();
