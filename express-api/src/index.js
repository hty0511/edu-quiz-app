const express = require('express');
const session = require('express-session');
const { join } = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const { HOST, PORT, SESSION_SECRET } = require('./config');
require('./models/associations'); // Setup model associations
const usersRouter = require('./routes/users');
const cppQuizzesRouter = require('./routes/cpp-quizzes');
const logger = require('./utils/logger');

const app = express();

app.use(express.json()); // Parse incoming JSON payloads

// session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// Load and setup Swagger documentation
const swaggerDocument = YAML.load(join(__dirname, './docs/swagger/bundled.yaml'));
app.use('/express-api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Attach routers
app.use('/express-api/users', usersRouter);
app.use('/express-api/cpp-quizzes', cppQuizzesRouter);

// Global error handler middleware
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message || err.toString()}`);
  res.status(500).send('Server Error');
});

// Start the Express server
app.listen(PORT, HOST, () => {
  logger.info(`Server is up on ${HOST}:${PORT}`);
});
