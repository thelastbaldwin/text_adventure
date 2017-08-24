const vorpal = require("vorpal")();
const version = require("./package.json").version;

vorpal
    .delimiter(">")
    .show();
