const path = require("path");

// __dirname === /var/task/backend/api
const app = require(path.join(__dirname, "../dist/app.js"));

module.exports = app;
