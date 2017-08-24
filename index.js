const program = require("commander");
const version = require("./package.json").version;

program
    .version(version)
    .option("-l, --list [list]", "test command description")
    .parse(process.argv);

console.log("The value of list is: ", program.list, process.env);
