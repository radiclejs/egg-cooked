const Application = require('./framework').Application;

const app = new Application({
  baseDir: __dirname
});

app.ready(() => {
  app.listen(app.config.port);
});
