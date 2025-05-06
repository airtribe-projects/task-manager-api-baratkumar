const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dynamic route loading from the 'routes' directory
const fs = require('fs').promises;
const path = require('path');

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Async dynamic route loading with path.basename for maintainability
(async () => {
  const routesPath = path.join(__dirname, 'routes');
  try {
    const files = await fs.readdir(routesPath);
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        const route = require(path.join(routesPath, file));
        const basename = path.basename(file, '.js');
        app.use(`/${basename}`, route);
      }
    });
  } catch (err) {
    console.error('Error loading routes:', err);
  }
})();

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
