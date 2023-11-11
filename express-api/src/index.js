const express = require('express');
const session = require('express-session');
const { join } = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const { HOST, PORT, SESSION_SECRET } = require('./config');
require('./models/associations'); // Setup model associations
const usersRouter = require('./routes/users');
const cppQuizzesRouter = require('./routes/cpp-quizzes');
const errorHandler = require('./middleware/error-handler');
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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Attach routers
app.use('/api/users', usersRouter);
app.use('/api/cpp-quizzes', cppQuizzesRouter);

// Global error handler middleware
app.use(errorHandler);

// Start the Express server
app.listen(PORT, HOST, () => {
  logger.info(`Server is up on ${HOST}:${PORT}`);
});
